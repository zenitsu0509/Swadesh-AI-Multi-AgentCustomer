import { generateText, Message } from 'ai';
import { chatModel } from '../lib/ai';

export type AgentType = 'support' | 'order' | 'billing';

const systemPrompt = `
You are a Supervisor (Router) Agent for a Customer Support System.
Your job is to analyze the conversation history and the latest user message to determine which specialized sub-agent should handle the request.

The available sub-agents are:
1. "order": Handles order status, tracking, modifications, cancellations, delivery.
2. "billing": Handles payment issues, refunds, invoices, subscription queries.
3. "support": Handles general inquiries, FAQs, troubleshooting, greetings, and anything else not covered by order or billing.

Check the CONVERSATION CONTEXT to understand if the user is continuing a previous topic.
RETURN ONLY the name of the agent: "order", "billing", or "support". Do not output anything else.
`;

export async function routeQuery(messages: Message[]): Promise<AgentType> {
  const lastMessage = messages[messages.length - 1];
  
  // We can format the history to help the router
  // For simplicity, we pass the messages to the model with the system prompt
  
  const { text } = await generateText({
    model: chatModel,
    system: systemPrompt,
    messages: messages, 
    // We restrict the output tokens to ensure it's just the classification
    maxTokens: 10, 
    temperature: 0.1, // Low temp for deterministic routing
  });

  const decision = text.trim().toLowerCase();
  
  if (decision.includes('order')) return 'order';
  if (decision.includes('billing')) return 'billing';
  return 'support'; // Default fallback
}
