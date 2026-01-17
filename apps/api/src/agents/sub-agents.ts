import { streamText, Message } from 'ai';
import { chatModel } from '../lib/ai';
import { 
  getOrderDetailsTool, 
  checkDeliveryStatusTool, 
  getInvoiceDetailsTool, 
  checkRefundStatusTool 
} from '../tools';

export async function runSupportAgent(messages: Message[]) {
  return streamText({
    model: chatModel,
    system: 'You are a compassionate Customer Support Agent. You handle general inquiries, FAQs, and troubleshooting. If you cannot help, advise the user to contact human support.',
    messages,
  });
}

export async function runOrderAgent(messages: Message[]) {
  console.log('🤖 Order Agent starting with', messages.length, 'messages');
  
  // First, let's test without tools to confirm streaming works
  const result = streamText({
    model: chatModel,
    system: `You are an Order Management Agent. You help users with their orders.
    
Available order data (use this to answer questions):
- ORD-001: Laptop & Mouse, $1200, Status: shipped, Delivery: 2023-10-25
- ORD-002: Monitor, $300, Status: pending
- ORD-003: Keyboard, $50, Status: delivered, Delivery: 2023-10-20

When a user asks about an order, look up the information above and respond directly.`,
    messages,
  });
  
  console.log('🤖 Order Agent streamText object created');
  return result;
}

export async function runBillingAgent(messages: Message[]) {
  return streamText({
    model: chatModel,
    system: 'You are a Billing Support Agent. You help users with invoices, payments, and refunds. You have tools to check invoices and refund status.',
    messages,
    tools: {
      getInvoiceDetails: getInvoiceDetailsTool,
      checkRefundStatus: checkRefundStatusTool,
    },
  });
}
