import React from 'react';
import { Badge, Dropdown } from '@marmeto_engineering/anthers-components';
import { Download, EllipsisVertical, Pencil, Share2, Trash2 } from 'lucide-react';

import type { ReportOrderEdge } from './types';

/** Column config aligned with the Anthers Advanced Data Table docs example. */
export const reportColumns = [
  {
    key: 'id',
    header: 'Order',
    render: (item: ReportOrderEdge) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-zinc-900">{item.node.id}</span>
        <span className="text-small text-zinc-500">{item.node.date}</span>
      </div>
    ),
  },
  {
    key: 'customer',
    header: 'Customer',
    render: (item: ReportOrderEdge) => <span className="text-zinc-900">{item.node.customer}</span>,
  },
  {
    key: 'channel',
    header: 'Channel',
    render: (item: ReportOrderEdge) => <span className="text-zinc-500">{item.node.channel}</span>,
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
      <Badge color={item.node.paymentStatus === 'Paid' ? 'neutral' : 'warning'}>{item.node.paymentStatus}</Badge>
    ),
  },
  {
    key: 'fulfillmentStatus',
    header: 'Fulfillment status',
    render: (item: ReportOrderEdge) => (
      <Badge color={item.node.fulfillmentStatus === 'Fulfilled' ? 'success' : 'warning'}>
        {item.node.fulfillmentStatus}
      </Badge>
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
    render: (_item: ReportOrderEdge) => (
      <div className="flex justify-end" onPointerDown={(event) => event.stopPropagation()}>
        <Dropdown
          buttonSize="icon"
          buttonVariant="ghost"
          dropDownIcon={<EllipsisVertical size={16} strokeWidth={1.75} />}
          dropdownConfig={[
            {
              items: [
                {
                  label: 'Download',
                  value: 'download',
                  icon: <Download size={16} strokeWidth={1.75} />,
                  onClick: () => undefined,
                },
                {
                  label: 'Share',
                  value: 'share',
                  icon: <Share2 size={16} strokeWidth={1.75} />,
                  onClick: () => undefined,
                },
                {
                  label: 'Edit',
                  value: 'edit',
                  icon: <Pencil size={16} strokeWidth={1.75} />,
                  onClick: () => undefined,
                },
                {
                  label: 'Delete',
                  value: 'delete',
                  icon: <Trash2 size={16} strokeWidth={1.75} />,
                  variant: 'critical',
                  onClick: () => undefined,
                },
              ],
            },
          ]}
        />
      </div>
    ),
  },
];
