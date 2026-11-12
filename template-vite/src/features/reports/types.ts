export type ReportPaymentStatus = 'Paid' | 'Unpaid' | 'Refunded' | 'Payment pending';
export type ReportFulfillmentStatus = 'Unfulfilled' | 'Partially Fulfilled' | 'Fulfilled';

export interface ReportOrderNode {
  id: string;
  date: string;
  customer: string;
  channel: string;
  tags: string[];
  total: string;
  deliveryMethod: string;
  paymentStatus: ReportPaymentStatus;
  fulfillmentStatus: ReportFulfillmentStatus;
  items: string;
}

export interface ReportOrderEdge {
  cursor: string;
  node: ReportOrderNode;
}

export interface ReportListingPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

/** Envelope shape expected by Anthers `AdvancedDataTable`. */
export interface ReportListingData {
  state: 'data';
  edges: ReportOrderEdge[];
  pageInfo: ReportListingPageInfo;
}
