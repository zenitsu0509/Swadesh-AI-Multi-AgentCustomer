export interface Order {
  id: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: string[];
  total: number;
  deliveryDate?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded';
  link: string;
}

export const orders: Order[] = [
  { id: 'ORD-001', status: 'shipped', items: ['Laptop', 'Mouse'], total: 1200, deliveryDate: '2023-10-25' },
  { id: 'ORD-002', status: 'pending', items: ['Monitor'], total: 300 },
  { id: 'ORD-003', status: 'delivered', items: ['Keyboard'], total: 50, deliveryDate: '2023-10-20' },
];

export const invoices: Invoice[] = [
  { id: 'INV-001', orderId: 'ORD-001', amount: 1200, status: 'paid', link: '/invoices/INV-001.pdf' },
  { id: 'INV-002', orderId: 'ORD-002', amount: 300, status: 'pending', link: '/invoices/INV-002.pdf' },
];

export const users = [
    { id: 'user-1', name: "Alice" }
];
