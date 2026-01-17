# Swadesh AI - Multi-Agent Customer Support System

An intelligent AI-powered customer support system that uses a multi-agent architecture to route queries to specialized agents with domain-specific tools.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8.0+
- Groq API key ([get one free](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/zenitsu0509/Swadesh-AI-Multi-AgentCustomer.git
cd Swadesh-AI-Multi-AgentCustomer

# Install dependencies
pnpm install

# Set up environment variables
cd apps/api
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Return to root and start development
cd ../..
pnpm dev
```

The API will run on `http://localhost:3000` and the web app on `http://localhost:5173`.

---

## 📖 Overview

### What It Does
This system provides intelligent customer support through specialized AI agents:

- **Router Agent**: Analyzes queries and routes to the right specialist
- **Support Agent**: Handles general inquiries and FAQs
- **Order Agent**: Manages order tracking and delivery status
- **Billing Agent**: Handles invoices, payments, and refunds

### Key Features
- 🤖 **Multi-Agent Architecture**: Specialized agents for different domains
- 🔄 **Intelligent Routing**: Context-aware query classification
- 🛠️ **Agent Tools**: Each agent has access to domain-specific data
- 💬 **Streaming Responses**: Real-time AI responses
- 📱 **Modern UI**: Clean, responsive interface with Tailwind CSS
- 📦 **Monorepo**: Organized with Turborepo for scalability

---

## 🏗️ Architecture

```
User Query → Router Agent → [Support|Order|Billing] Agent → Tools → Response
```

**Router Logic**:
1. Receives conversation history
2. Analyzes context and intent
3. Routes to specialized sub-agent
4. Sub-agent executes with tools if needed
5. Streams response back to user

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Hono (lightweight, fast web framework)
- **AI**: Vercel AI SDK + Groq (Llama 3.3 70B)
- **Validation**: Zod schemas
- **Runtime**: Node.js with tsx

### Frontend
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Icons**: Lucide React
- **Chat**: AI SDK React hooks

### Development
- **Monorepo**: Turborepo + pnpm workspaces
- **Type Safety**: TypeScript across the stack

---

## 📁 Project Structure

```
swadesh-ai/
├── apps/
│   ├── api/              # Backend API
│   │   └── src/
│   │       ├── index.ts         # Server & routes
│   │       ├── agents/          # Router & sub-agents
│   │       ├── tools.ts         # Agent tools
│   │       ├── data.ts          # Mock database
│   │       └── lib/ai.ts        # AI configuration
│   │
│   └── web/              # Frontend
│       └── src/
│           ├── App.tsx          # Main UI
│           └── main.tsx         # Entry point
│
├── package.json          # Root workspace config
├── pnpm-workspace.yaml   # Workspace definition
└── turbo.json           # Turbo build config
```

---

##  API Endpoints

### Chat
- `POST /api/chat/messages` - Send message, get AI response (streaming)
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get specific conversation

### Health
- `GET /` - Health check

---

## 🤖 Agents & Tools

### Support Agent
**Purpose**: General inquiries, FAQs, troubleshooting  
**Tools**: None (conversational)

### Order Agent
**Purpose**: Order tracking and management  
**Tools**:
- `getOrderDetails(orderId)` - Fetch order information
- `checkDeliveryStatus(orderId)` - Check shipping status

### Billing Agent
**Purpose**: Payment and invoice management  
**Tools**:
- `getInvoiceDetails(invoiceId)` - Retrieve invoice
- `checkRefundStatus(orderId/invoiceId)` - Check refund status

---

## 💾 Data Models

### Mock Database
The system includes sample data:
- **3 Orders**: Various statuses (pending, shipped, delivered)
- **2 Invoices**: Different payment states

**Note**: Currently uses in-memory storage. For production, migrate to PostgreSQL with Drizzle/Prisma.

---

## 🧪 Example Queries

Try these in the chat interface:

```
# Order Agent
"What's the status of order ORD-001?"
"When will my order ORD-002 be delivered?"

# Billing Agent
"Show me invoice INV-001"
"Has my refund for order ORD-001 been processed?"

# Support Agent
"How do I reset my password?"
"What are your business hours?"
```

---

## 🔧 Development

### Available Scripts

```bash
# Start all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Start production build
pnpm start
```

### Environment Variables

Create `apps/api/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🎯 Features Implemented

### Core Requirements ✅
- ✅ Multi-agent architecture
- ✅ Router agent with intent classification
- ✅ 3 specialized sub-agents
- ✅ 4 agent tools with mock data
- ✅ RESTful API
- ✅ Streaming responses
- ✅ Conversation persistence
- ✅ Error handling

### Bonus Features ✅
- ✅ **Monorepo with Turbo** (+30 points)
- ✅ Agent typing indicator
- ✅ Agent name display
- ✅ Modern UI/UX

---

## 🚧 Future Enhancements

### High Priority
- [ ] Database integration (PostgreSQL + Drizzle)
- [ ] Hono RPC for end-to-end type safety
- [ ] Unit and integration tests
- [ ] Rate limiting

### Nice to Have
- [ ] User authentication
- [ ] Token compaction for long conversations
- [ ] AI reasoning display
- [ ] Live deployment
- [ ] Conversation history sidebar
- [ ] Dark mode

---

## 📝 Technical Decisions

### Why Groq?
- Fast inference (faster than OpenAI for streaming)
- Free tier available
- Good Llama 3 model support

### Why Hono?
- Ultra-lightweight (faster than Express)
- TypeScript-first
- Better for edge/serverless deployments
- Native streaming support

### Why Monorepo?
- Code sharing between frontend/backend
- Single dependency tree
- Easier type safety with shared types
- Professional project structure

---

## 🐛 Troubleshooting

### API not starting?
- Ensure `GROQ_API_KEY` is set in `apps/api/.env`
- Check Node.js version (20+)

### Frontend not connecting?
- Verify API is running on port 3000
- Check proxy configuration in `vite.config.ts`

### Agents not routing correctly?
- Check Groq API key validity
- Review router prompts in `agents/router.ts`

---

## 📚 Additional Documentation

For a comprehensive technical report, see [PROJECT_REPORT.md](./PROJECT_REPORT.md).

---

## 🤝 Contributing

This is an assessment project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project as a learning resource.

---

## 🙏 Acknowledgments

- Built for the Applied AI Research Intern Assessment
- Powered by Groq's Llama 3.3 70B model
- UI inspired by modern chat interfaces

---

**Built with ❤️ for intelligent customer support**

For questions or issues, please open a GitHub issue.
