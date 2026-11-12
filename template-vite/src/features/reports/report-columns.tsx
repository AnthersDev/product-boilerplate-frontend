import React from 'react';
import { Badge, Tag } from '@marmeto_engineering/anthers-components';
import { MoreVertical } from 'lucide-react';

import type { ReportFulfillmentStatus, ReportOrderEdge, ReportPaymentStatus } from './types';

const paymentColor: Record<ReportPaymentStatus, 'success' | 'warning' | 'neutral'> = {
  Paid: 'success',
  Unpaid: 'warning',
  Refunded: 'neutral',
  'Payment pending': 'warning',
};

const fulfillmentColor: Record<ReportFulfillmentStatus, 'success' | 'warning'> = {
  Fulfilled: 'success',
  Unfulfilled: 'warning',
  'Partially Fulfilled': 'warning',
};

/** Column config aligned with the Anthers Advanced Data Table default story. */
export const reportColumns = [
  {
    key: 'id',
    header: 'Order',
    render: (item: ReportOrderEdge) => <span className="font-medium text-zinc-900">{item.node.id}</span>,
  },
  {
    key: 'date',
    header: 'Date',
    render: (item: ReportOrderEdge) => <span className="text-zinc-700">{item.node.date}</span>,
  },
  {
    key: 'customer',
    header: 'Customer',
    render: (item: ReportOrderEdge) => <span className="text-zinc-900">{item.node.customer}</span>,
  },
  {
    key: 'channel',
    header: 'Channel',
    render: (item: ReportOrderEdge) => <span className="text-zinc-700">{item.node.channel}</span>,
  },
  {
    key: 'tags',
    header: 'Tags',
    render: (item: ReportOrderEdge) => (
      <div className="flex flex-wrap gap-1">
        {item.node.tags.map((tag) => (
          <Tag key={tag} size="sm">
            {tag}
          </Tag>
        ))}
      </div>
    ),
  },
  {
    key: 'total',
    header: 'Total',
    render: (item: ReportOrderEdge) => <span className="text-zinc-900">{item.node.total}</span>,
  },
  {
    key: 'deliveryMethod',
    header: 'Delivery method',
    render: (item: ReportOrderEdge) => <span className="text-zinc-700">{item.node.deliveryMethod}</span>,
  },
  {
    key: 'paymentStatus',
    header: 'Payment status',
    render: (item: ReportOrderEdge) => (
      <Badge color={paymentColor[item.node.paymentStatus]}>{item.node.paymentStatus}</Badge>
    ),
  },
  {
    key: 'fulfillmentStatus',
    header: 'Fulfillment status',
    render: (item: ReportOrderEdge) => (
      <Badge color={fulfillmentColor[item.node.fulfillmentStatus]}>{item.node.fulfillmentStatus}</Badge>
    ),
  },
  {
    key: 'items',
    header: 'Items',
    render: (item: ReportOrderEdge) => <span className="text-zinc-700">{item.node.items}</span>,
  },
  {
    key: 'actions',
    header: '',
    sortable: false,
    render: () => (
      <button
        type="button"
        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
        aria-label="Row actions"
      >
        <MoreVertical size={16} strokeWidth={1.75} />
      </button>
    ),
  },
];
