import type { ReportListingData, ReportOrderNode } from '@/features/reports';

import type { MockRequest, MockResponse, MockRoute } from './types';

const PAGE_SIZE = 10;
const FILTER_TYPE = 'reports';
const VIEWS_STORAGE_KEY = Symbol('mock-api:report-filter-views');

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

const REPORT_FILTERS = [
  {
    type: 'select',
    label: 'Payment status',
    value: 'payment_status',
    options: [
      { label: 'Paid', value: 'Paid' },
      { label: 'Unpaid', value: 'Unpaid' },
      { label: 'Refunded', value: 'Refunded' },
      { label: 'Payment pending', value: 'Payment pending' },
      { label: 'Cancelled', value: 'Cancelled' },
    ],
  },
  {
    type: 'select',
    label: 'Channel',
    value: 'channel',
    options: [
      { label: 'Online Store', value: 'Online Store' },
      { label: 'POS', value: 'POS' },
    ],
  },
  {
    type: 'select',
    label: 'Fulfillment status',
    value: 'fulfillment_status',
    options: [
      { label: 'Unfulfilled', value: 'Unfulfilled' },
      { label: 'Partially Fulfilled', value: 'Partially Fulfilled' },
      { label: 'Fulfilled', value: 'Fulfilled' },
    ],
  },
];

interface SavedFilterView {
  id: string;
  name: string;
  type: string;
  editable: boolean;
  filters: {
    queryParams: Record<string, string[]>;
    selectedFilterOptions: { label: string; value: string }[];
    selectedFilterSubOptions: Record<string, { label: string; value: string }[]>;
  };
}

const DEFAULT_VIEWS: SavedFilterView[] = [
  {
    id: 'view_all',
    name: 'All orders',
    type: FILTER_TYPE,
    editable: false,
    filters: {
      queryParams: {},
      selectedFilterOptions: [],
      selectedFilterSubOptions: {},
    },
  },
  {
    id: 'view_paid',
    name: 'Paid',
    type: FILTER_TYPE,
    editable: true,
    filters: {
      queryParams: { payment_status: ['Paid'] },
      selectedFilterOptions: [{ label: 'Payment status', value: 'payment_status' }],
      selectedFilterSubOptions: {
        payment_status: [{ label: 'Paid', value: 'Paid' }],
      },
    },
  },
  {
    // Deliberately matches no rows so the saved view demos the empty table state.
    id: 'view_empty',
    name: 'Empty demo',
    type: FILTER_TYPE,
    editable: true,
    filters: {
      queryParams: { payment_status: ['Cancelled'] },
      selectedFilterOptions: [{ label: 'Payment status', value: 'payment_status' }],
      selectedFilterSubOptions: {
        payment_status: [{ label: 'Cancelled', value: 'Cancelled' }],
      },
    },
  },
];

const ok = (data: unknown, message?: string): MockResponse => ({
  data: { status: true, message, data },
});

const fail = (status: number, message: string): MockResponse => ({
  status,
  data: { status: false, message },
});

const getViews = (adapterStorage: Map<symbol, unknown>): SavedFilterView[] => {
  const existing = adapterStorage.get(VIEWS_STORAGE_KEY);
  if (Array.isArray(existing)) return existing as SavedFilterView[];
  const views = structuredClone(DEFAULT_VIEWS);
  adapterStorage.set(VIEWS_STORAGE_KEY, views);
  return views;
};

const setViews = (adapterStorage: Map<symbol, unknown>, views: SavedFilterView[]) => {
  adapterStorage.set(VIEWS_STORAGE_KEY, views);
};

const readParamValues = (query: URLSearchParams, key: string) => {
  const values = [...query.getAll(key), ...query.getAll(`${key}[]`)].map((value) => value.trim()).filter(Boolean);
  return [...new Set(values)];
};

const matchesSearch = (order: ReportOrderNode, query: string) => {
  const haystack = [order.id, order.customer, order.channel, ...order.tags].join(' ').toLowerCase();
  return haystack.includes(query);
};

const filterOrders = (query: URLSearchParams) => {
  const search = (query.get('q') ?? '').trim().toLowerCase();
  const paymentStatuses = readParamValues(query, 'payment_status');
  const channels = readParamValues(query, 'channel');
  const fulfillmentStatuses = readParamValues(query, 'fulfillment_status');

  return ORDERS.filter((order) => {
    if (search && !matchesSearch(order, search)) return false;
    if (paymentStatuses.length && !paymentStatuses.includes(order.paymentStatus)) return false;
    if (channels.length && !channels.includes(order.channel)) return false;
    if (fulfillmentStatuses.length && !fulfillmentStatuses.includes(order.fulfillmentStatus)) return false;
    return true;
  });
};

const paginate = (filtered: ReportOrderNode[], query: URLSearchParams): ReportListingData => {
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

  return {
    state: 'data',
    edges,
    pageInfo: {
      hasNextPage: startIndex + PAGE_SIZE < filtered.length,
      hasPreviousPage: startIndex > 0,
      startCursor,
      endCursor,
    },
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readSavedViewBody = (body: unknown): Omit<SavedFilterView, 'id' | 'editable'> | null => {
  if (!isRecord(body) || typeof body.name !== 'string' || typeof body.type !== 'string') return null;
  const filters = isRecord(body.filters) ? body.filters : {};
  return {
    name: body.name.trim(),
    type: body.type,
    filters: {
      queryParams: isRecord(filters.queryParams)
        ? (filters.queryParams as SavedFilterView['filters']['queryParams'])
        : {},
      selectedFilterOptions: Array.isArray(filters.selectedFilterOptions)
        ? (filters.selectedFilterOptions as SavedFilterView['filters']['selectedFilterOptions'])
        : [],
      selectedFilterSubOptions: isRecord(filters.selectedFilterSubOptions)
        ? (filters.selectedFilterSubOptions as SavedFilterView['filters']['selectedFilterSubOptions'])
        : {},
    },
  };
};

export const reportsMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/reports',
    handler: ({ query }) => ok(paginate(filterOrders(query), query)),
  },
  {
    method: 'GET',
    path: '/filter-view',
    handler: ({ query, adapterStorage }) => {
      const type = query.get('type') ?? FILTER_TYPE;
      if (type !== FILTER_TYPE) {
        return ok({ filters: [], views: [] });
      }
      return ok({
        filters: REPORT_FILTERS,
        views: getViews(adapterStorage).filter((view) => view.type === type),
      });
    },
  },
  {
    method: 'POST',
    path: '/filter-view',
    handler: ({ body, adapterStorage }: MockRequest) => {
      const parsed = readSavedViewBody(body);
      if (!parsed?.name) return fail(400, 'A view name is required.');
      const views = getViews(adapterStorage);
      const created: SavedFilterView = {
        id: `view_${Date.now()}`,
        editable: true,
        ...parsed,
      };
      setViews(adapterStorage, [...views, created]);
      return ok(created, 'View saved.');
    },
  },
  {
    method: 'PUT',
    path: '/filter-view/:id',
    handler: ({ params, body, adapterStorage }) => {
      const parsed = readSavedViewBody(body);
      if (!parsed?.name) return fail(400, 'A view name is required.');
      const views = getViews(adapterStorage);
      const index = views.findIndex((view) => view.id === params.id);
      if (index < 0) return fail(404, 'View not found.');
      const updated: SavedFilterView = {
        ...views[index],
        ...parsed,
        id: views[index].id,
        editable: views[index].editable,
      };
      const next = [...views];
      next[index] = updated;
      setViews(adapterStorage, next);
      return ok(updated, 'View updated.');
    },
  },
  {
    method: 'DELETE',
    path: '/filter-view/:id',
    handler: ({ params, adapterStorage }) => {
      const views = getViews(adapterStorage);
      const next = views.filter((view) => view.id !== params.id);
      if (next.length === views.length) return fail(404, 'View not found.');
      setViews(adapterStorage, next);
      return ok(null, 'View deleted.');
    },
  },
];
