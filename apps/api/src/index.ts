import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { Message } from 'ai'
import { routeQuery } from './agents/router'
import { runBillingAgent, runOrderAgent, runSupportAgent } from './agents/sub-agents'

const app = new Hono()

// Broaden CORS to ensure streaming headers are visible to the browser
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposeHeaders: ['X-Agent-Type', 'X-Vercel-AI-Data-Stream', 'Content-Type'],
}))

app.get('/', (c) => {
  return c.text('Swadesh AI API is running!')
})

// In-memory persistence for demo purposes
// In production, use Postgres + Drizzle
interface Conversation {
  id: string;
  messages: Message[];
  created_at: string;
}
const dbConversations: Record<string, Conversation> = {};

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant', 'function', 'data', 'tool']),
    content: z.string(),
    id: z.string().optional(),
    name: z.string().optional(),
  })),
  conversationId: z.string().optional(),
});

// Chat Route
app.post('/api/chat/messages', zValidator('json', chatSchema), async (c) => {
  const { messages, conversationId } = c.req.valid('json');
  
  // Persist incoming user message
  const currentId = conversationId || crypto.randomUUID();
  if (!dbConversations[currentId]) {
    dbConversations[currentId] = { id: currentId, messages: [], created_at: new Date().toISOString() };
  }
  // dbConversations[currentId].messages = messages; // Sync with client state

  // 1. Analyze and Route
  console.log('Analyzing intent for last message...');
  let agentType;
  try {
    agentType = await routeQuery(messages as Message[]);
    console.log(`Routed to agent: ${agentType}`);
  } catch (error) {
    console.error('Error in routing:', error);
    agentType = 'support'; // Fallback to support agent
    console.log('Falling back to support agent due to routing error');
  }

  // 2. Execute Sub-Agent
  let result;
  try {
    console.log(`Executing ${agentType} agent...`);
    switch (agentType) {
      case 'order':
        result = await runOrderAgent(messages as Message[]);
        break;
      case 'billing':
        result = await runBillingAgent(messages as Message[]);
        break;
      case 'support':
      default:
        result = await runSupportAgent(messages as Message[]);
        break;
    }

    console.log('Agent execution completed, streaming response...');
    
    // Use data stream for proper tool handling
    const response = result.toDataStreamResponse();
    
    // Add custom header for agent type
    response.headers.set('X-Agent-Type', agentType);
    response.headers.set('Access-Control-Expose-Headers', 'X-Agent-Type, Content-Type');
    
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    return response;
  } catch (error) { // Error handling
      console.error('Error executing agent:', error);
      return c.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
})

// Conversation Routes
app.get('/api/conversations', (c) => {
    return c.json(Object.values(dbConversations).sort((a,b) => b.created_at.localeCompare(a.created_at)));
})

app.get('/api/conversations/:id', (c) => {
    const id = c.req.param('id');
    const conv = dbConversations[id];
    if (!conv) return c.json({ error: 'Not found' }, 404);
    return c.json(conv);
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

export type AppType = typeof app
export default app
