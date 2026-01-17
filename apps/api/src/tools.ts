import { z } from 'zod';
import { orders, invoices } from './data';

// Order Tools
export const getOrderDetailsTool = {
  description: 'Get details of a specific order',
  parameters: z.object({
    orderId: z.string().describe('The ID of the order to retrieve'),
  }),
  execute: async ({ orderId }: { orderId: string }) => {
    console.log('🔧 Tool called: getOrderDetails with orderId:', orderId);
    const order = orders.find(o => o.id === orderId);
    console.log('🔧 Tool result:', order || 'Order not found');
    if (!order) return { error: 'Order not found' };
    return order;
  },
};

export const checkDeliveryStatusTool = {
  description: 'Check the delivery status of an order',
  parameters: z.object({
    orderId: z.string().describe('The ID of the order to check'),
  }),
  execute: async ({ orderId }: { orderId: string }) => {
    console.log('🔧 Tool called: checkDeliveryStatus with orderId:', orderId);
    const order = orders.find(o => o.id === orderId);
    const result = order ? { status: order.status, deliveryDate: order.deliveryDate } : { error: 'Order not found' };
    console.log('🔧 Tool result:', result);
    if (!order) return { error: 'Order not found' };
    return { status: order.status, deliveryDate: order.deliveryDate };
  },
};

// Billing Tools
export const getInvoiceDetailsTool = {
  description: 'Get details of an invoice',
  parameters: z.object({
    invoiceId: z.string().describe('The ID of the invoice'),
  }),
  execute: async ({ invoiceId }: { invoiceId: string }) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return { error: 'Invoice not found' };
    return invoice;
  },
};

export const checkRefundStatusTool = {
  description: 'Check the refund status of an order or invoice',
  parameters: z.object({
    orderId: z.string().optional(),
    invoiceId: z.string().optional(),
  }),
  execute: async ({ orderId, invoiceId }: { orderId?: string, invoiceId?: string }) => {
    const invoice = invoices.find(i => i.id === invoiceId || i.orderId === orderId);
    if (!invoice) return { error: 'Invoice/Order not found' };
    return { status: invoice.status === 'refunded' ? 'Refunded' : 'Not Refunded' };
  },
};
