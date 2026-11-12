import type { ReportListingData, ReportOrderNode } from '@/features/reports';

import type { MockResponse, MockRoute } from './types';

const PAGE_SIZE = 10;

const ORDERS: ReportOrderNode[] = [
  {
    id: '1014',
    date: 'Today at 3:17 am',
    customer: 'Aliva P',
    channel: 'Online Store',
    tags: ['recurpay'],
    total: '₹411.19',
    deliveryMethod: 'Standard',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: '2 items',
  },
  {
    id: '1013',
    date: 'Today at 1:02 am',
    customer: 'Neha Sharma',
    channel: 'Online Store',
    tags: ['promo'],
    total: '₹1,250.00',
    deliveryMethod: 'Express',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: '3 items',
  },
  {
    id: '1012',
    date: 'Yesterday at 6:45 pm',
    customer: 'Rahul Mehta',
    channel: 'POS',
    tags: ['store'],
    total: '₹980.50',
    deliveryMethod: 'Pickup',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: '1 item',
  },
  {
    id: '1011',
    date: 'Yesterday at 2:11 pm',
    customer: 'Priya Nair',
    channel: 'Online Store',
    tags: ['return'],
    total: '₹640.00',
    deliveryMethod: 'Standard',
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Fulfilled',
    items: '2 items',
  },
  {
    id: '1010',
    date: 'Aug 20 at 10:10 am',
    customer: 'Amit Joshi',
    channel: 'Online Store',
    tags: ['bulk', 'priority'],
    total: '₹3,200.00',
    deliveryMethod: 'Standard + 1',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Partially Fulfilled',
    items: '8 items',
  },
  {
    id: '1009',
    date: 'Aug 19 at 9:04 pm',
    customer: 'Sara Khan',
    channel: 'Online Store',
    tags: ['subscription'],
    total: '₹499.00',
    deliveryMethod: 'Standard',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: '1 item',
  },
  {
    id: '1008',
    date: 'Aug 19 at 4:22 pm',
    customer: 'Vikram Rao',
    channel: 'POS',
    tags: ['store'],
    total: '₹2,150.75',
    deliveryMethod: 'Pickup',
    paymentStatus: 'Unpaid',
    fulfillmentStatus: 'Unfulfilled',
    items: '4 items',
  },
  {
    id: '1007',
    date: 'Aug 18 at 11:48 am',
    customer: 'Ananya Iyer',
    channel: 'Online Store',
    tags: ['easyship'],
    total: '₹875.00',
    deliveryMethod: 'Express',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: '2 items',
  },
  {
    id: '1006',
    date: 'Aug 17 at 8:15 am',
    customer: 'Rohan Desai',
    channel: 'Online Store',
    tags: ['promo', 'bulk'],
    total: '₹4,980.00',
    deliveryMethod: 'Standard',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Partially Fulfilled',
    items: '12 items',
  },
  {
    id: '1005',
    date: 'Aug 16 at 7:33 pm',
    customer: 'Meera Kapoor',
    channel: 'Online Store',
    tags: ['recurpay'],
    total: '₹299.00',
    deliveryMethod: 'Standard',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: '1 item',
  },
  {
    id: '1004',
    date: 'Aug 15 at 3:05 pm',
    customer: 'Kabir Singh',
    channel: 'POS',
    tags: ['store'],
    total: '₹1,120.40',
    deliveryMethod: 'Pickup',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: '3 items',
  },
  {
    id: '1003',
    date: 'Aug 14 at 12:40 pm',
    customer: 'Ishita Banerjee',
    channel: 'Online Store',
    tags: ['priority'],
    total: '₹760.00',
    deliveryMethod: 'Express',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: '2 items',
  },
  {
    id: '1002',
    date: 'Aug 13 at 6:18 am',
    customer: 'Arjun Patel',
    channel: 'Online Store',
    tags: ['subscription'],
    total: '₹1,899.00',
    deliveryMethod: 'Standard',
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Fulfilled',
    items: '5 items',
  },
  {
    id: '1001',
    date: 'Aug 12 at 9:51 pm',
    customer: 'Diya Menon',
    channel: 'Online Store',
    tags: ['promo'],
    total: '₹540.25',
    deliveryMethod: 'Standard',
    paymentStatus: 'Unpaid',
    fulfillmentStatus: 'Unfulfilled',
    items: '2 items',
  },
  {
    id: '1000',
    date: 'Aug 11 at 2:27 pm',
    customer: 'Nikhil Verma',
    channel: 'POS',
    tags: ['store', 'bulk'],
    total: '₹6,450.00',
    deliveryMethod: 'Pickup',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: '15 items',
  },
];

const ok = (data: ReportListingData): MockResponse => ({ data: { status: true, data } });

const matchesSearch = (order: ReportOrderNode, query: string) => {
  const haystack = [order.id, order.customer, order.channel, ...order.tags].join(' ').toLowerCase();
  return haystack.includes(query);
};

export const reportsMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/reports',
    handler: ({ query }) => {
      const search = (query.get('q') ?? '').trim().toLowerCase();
      const filtered = search ? ORDERS.filter((order) => matchesSearch(order, search)) : ORDERS;

      const after = query.get('after');
      const before = query.get('before');

      let startIndex = 0;
      if (after) {
        const afterIndex = filtered.findIndex((order) => order.id === after);
        startIndex = afterIndex >= 0 ? afterIndex + 1 : 0;
      } else if (before) {
        const beforeIndex = filtered.findIndex((order) => order.id === before);
        startIndex = Math.max(0, (beforeIndex >= 0 ? beforeIndex : filtered.length) - PAGE_SIZE);
      }

      const page = filtered.slice(startIndex, startIndex + PAGE_SIZE);
      const edges = page.map((node) => ({ cursor: node.id, node }));
      const startCursor = edges[0]?.cursor ?? null;
      const endCursor = edges[edges.length - 1]?.cursor ?? null;

      return ok({
        state: 'data',
        edges,
        pageInfo: {
          hasNextPage: startIndex + PAGE_SIZE < filtered.length,
          hasPreviousPage: startIndex > 0,
          startCursor,
          endCursor,
        },
      });
    },
  },
];
