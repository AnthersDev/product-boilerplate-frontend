import { getUnauthorizedSessionResponse } from './auth-handlers';
import type { MockResponse, MockRoute } from './types';

interface NotificationNode {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

interface NotificationEdge {
  node: NotificationNode;
  cursor: string;
}

const STORAGE_KEY = Symbol('mock-api:notifications');

interface NotificationDetails {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  subject: string;
  template: string;
  parsedTemplate: string;
  cc: string[];
  bcc: string[];
  variables: Array<{ key: string; label: string; defaultValue: string }>;
}

interface NotificationStorage {
  edges: NotificationEdge[];
  detailsById: Record<string, NotificationDetails>;
  settings: {
    senderName: string;
    senderEmail: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    logo: string;
  };
}

const SAMPLE_EDGES: NotificationEdge[] = [
  {
    node: {
      id: 'b1ca5831-2408-4f38-89c1-84ca60b775b6',
      title: 'New order is created',
      description: 'Sent to you and seller when a new order is placed',
      isActive: true,
    },
    cursor: 'WyJOZXcgb3JkZXIgaXMgY3JlYXRlZCIsImIxY2E1ODMxLTI0MDgtNGYzOC04OWMxLTg0Y2E2MGI3NzViNiJd',
  },
  {
    node: {
      id: '1c7938c4-d0fe-4c0e-8946-2a83a9118928',
      title: 'New seller has registered',
      description: 'Sent to you when a new seller fills and submits the registration form',
      isActive: true,
    },
    cursor: 'WyJOZXcgc2VsbGVyIGhhcyByZWdpc3RlcmVkIiwiMWM3OTM4YzQtZDBmZS00YzBlLTg5NDYtMmE4M2E5MTE4OTI4Il0=',
  },
  {
    node: {
      id: 'bd348fb7-c8f5-43c3-ba14-7bb587b99860',
      title: 'Order is cancelled',
      description: 'Sent to you and seller when an order is cancelled',
      isActive: true,
    },
    cursor: 'WyJPcmRlciBpcyBjYW5jZWxsZWQiLCJiZDM0OGZiNy1jOGY1LTQzYzMtYmExNC03YmI1ODdiOTk4NjAiXQ==',
  },
  {
    node: {
      id: 'b36a6e79-bd71-464b-b01e-601058084051',
      title: 'Order is delivered',
      description: 'Sent to you and seller when an order is delivered',
      isActive: true,
    },
    cursor: 'WyJPcmRlciBpcyBkZWxpdmVyZWQiLCJiMzZhNmU3OS1iZDcxLTQ2NGItYjAxZS02MDEwNTgwODQwNTEiXQ==',
  },
  {
    node: {
      id: '5737a61a-6e32-4299-baaa-68dc4584c7b7',
      title: 'Order is edited',
      description: 'Sent to you and seller when an order is edited',
      isActive: true,
    },
    cursor: 'WyJPcmRlciBpcyBlZGl0ZWQiLCI1NzM3YTYxYS02ZTMyLTQyOTktYmFhYS02OGRjNDU4NGM3YjciXQ==',
  },
  {
    node: {
      id: 'e8ea027a-5e30-41f9-8896-7ddfba1112bf',
      title: 'Order is fulfilled',
      description: 'Sent to you and seller when an order is fulfilled',
      isActive: true,
    },
    cursor: 'WyJPcmRlciBpcyBmdWxmaWxsZWQiLCJlOGVhMDI3YS01ZTMwLTQxZjktODg5Ni03ZGRmYmExMTEyYmYiXQ==',
  },
  {
    node: {
      id: '6ce2cbd3-1bab-4f07-9ef9-97239e8ee467',
      title: 'Product added by admin',
      description: 'Sent to seller when you add a new product for them',
      isActive: true,
    },
    cursor: 'WyJQcm9kdWN0IGFkZGVkIGJ5IGFkbWluIiwiNmNlMmNiZDMtMWJhYi00ZjA3LTllZjktOTcyMzllOGVlNDY3Il0=',
  },
  {
    node: {
      id: '79c3a601-7c67-4efd-9429-efba886f0b13',
      title: 'Product changes approved',
      description: 'Sent to seller when you approve a new product or updates made by them',
      isActive: true,
    },
    cursor: 'WyJQcm9kdWN0IGNoYW5nZXMgYXBwcm92ZWQiLCI3OWMzYTYwMS03YzY3LTRlZmQtOTQyOS1lZmJhODg2ZjBiMTMiXQ==',
  },
  {
    node: {
      id: '23bb3d00-3a31-44ca-8bea-24f9ed592f09',
      title: 'Product rejected',
      description: 'Sent to seller and you when any product update is rejected with a reason',
      isActive: true,
    },
    cursor: 'WyJQcm9kdWN0IHJlamVjdGVkIiwiMjNiYjNkMDAtM2EzMS00NGNhLThiZWEtMjRmOWVkNTkyZjA5Il0=',
  },
  {
    node: {
      id: 'aaf56bbb-35fa-4e92-95d6-bf5a6ce4465b',
      title: 'Product submitted for approval',
      description: 'Sent to you when a seller submits a new product for approval',
      isActive: true,
    },
    cursor: 'WyJQcm9kdWN0IHN1Ym1pdHRlZCBmb3IgYXBwcm92YWwiLCJhYWY1NmJiYi0zNWZhLTRlOTItOTVkNi1iZjVhNmNlNDQ2NWIiXQ==',
  },
  {
    node: {
      id: 'eb63758f-bc44-43b9-ab88-e862468f9cf5',
      title: 'Product updated by admin',
      description: 'Sent to seller when you make changes to a product',
      isActive: true,
    },
    cursor: 'WyJQcm9kdWN0IHVwZGF0ZWQgYnkgYWRtaW4iLCJlYjYzNzU4Zi1iYzQ0LTQzYjktYWI4OC1lODYyNDY4ZjljZjUiXQ==',
  },
  {
    node: {
      id: '1c7039bf-7653-46b3-95c3-ae0e93175fcc',
      title: 'Product updated by seller',
      description: 'Sent to you and seller when a seller updates a product',
      isActive: true,
    },
    cursor: 'WyJQcm9kdWN0IHVwZGF0ZWQgYnkgc2VsbGVyIiwiMWM3MDM5YmYtNzY1My00NmIzLTk1YzMtYWUwZTkzMTc1ZmNjIl0=',
  },
  {
    node: {
      id: '7bbbc512-cfd9-4570-8edf-546979368597',
      title: 'Seller is deactivated',
      description: 'Sent to seller when their account is deactivated',
      isActive: true,
    },
    cursor: 'WyJTZWxsZXIgaXMgZGVhY3RpdmF0ZWQiLCI3YmJiYzUxMi1jZmQ5LTQ1NzAtOGVkZi01NDY5NzkzNjg1OTciXQ==',
  },
  {
    node: {
      id: '4a672f4c-eb90-4e29-934d-b6ec8086bc7e',
      title: 'Seller onboarding approved',
      description: 'Sent to seller when their onboarding form is approved',
      isActive: true,
    },
    cursor: 'WyJTZWxsZXIgb25ib2FyZGluZyBhcHByb3ZlZCIsIjRhNjcyZjRjLWViOTAtNGUyOS05MzRkLWI2ZWM4MDg2YmM3ZSJd',
  },
  {
    node: {
      id: 'a9d7fe11-6913-4d97-90d6-cde3878ea18b',
      title: 'Seller onboarding rejected',
      description: 'Sent to seller when their onboarding form is rejected with a reason',
      isActive: true,
    },
    cursor: 'WyJTZWxsZXIgb25ib2FyZGluZyByZWplY3RlZCIsImE5ZDdmZTExLTY5MTMtNGQ5Ny05MGQ2LWNkZTM4NzhlYTE4YiJd',
  },
  {
    node: {
      id: '171ecb1a-de62-4331-bc6c-c2b776a12b24',
      title: "Seller's invitation",
      description: 'Sent to seller when you add them or they submit the registration form',
      isActive: true,
    },
    cursor: 'WyJTZWxsZXIncyBpbnZpdGF0aW9uIiwiMTcxZWNiMWEtZGU2Mi00MzMxLWJjNmMtYzJiNzc2YTEyYjI0Il0=',
  },
];

const defaultSettings = () => ({
  senderName: 'Your organization',
  senderEmail: 'noreply@example.com',
  buttonBackgroundColor: '#1a1a1a',
  buttonTextColor: '#fafafa',
  logo: '',
});

const buildDefaultTemplate = (node: NotificationNode) =>
  `<div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
  <h1 style="font-size: 20px; margin: 0 0 12px;">${node.title}</h1>
  <p style="margin: 0 0 16px; color: #4b5563;">${node.description}</p>
  <p style="margin: 0;">Hi {{recipient_name}},</p>
  <p style="margin: 12px 0 0;">This is a sample notification email for <strong>{{store_name}}</strong>.</p>
</div>`;

const getOrCreateDetails = (storage: NotificationStorage, node: NotificationNode): NotificationDetails => {
  const existing = storage.detailsById[node.id];
  if (existing) {
    existing.isActive = node.isActive;
    existing.title = node.title;
    existing.description = node.description;
    return existing;
  }

  const template = buildDefaultTemplate(node);
  const details: NotificationDetails = {
    id: node.id,
    title: node.title,
    description: node.description,
    isActive: node.isActive,
    subject: node.title,
    template,
    parsedTemplate: template,
    cc: [],
    bcc: [],
    variables: [
      { key: 'recipient_name', label: 'Recipient name', defaultValue: 'Alex' },
      { key: 'store_name', label: 'Store name', defaultValue: 'Your organization' },
    ],
  };
  storage.detailsById[node.id] = details;
  return details;
};

const getStorage = (adapterStorage: Map<symbol, unknown>): NotificationStorage => {
  const existing = adapterStorage.get(STORAGE_KEY);
  if (existing) return existing as NotificationStorage;

  const storage: NotificationStorage = {
    edges: SAMPLE_EDGES.map((edge) => ({
      ...edge,
      node: { ...edge.node },
    })),
    detailsById: {},
    settings: defaultSettings(),
  };
  adapterStorage.set(STORAGE_KEY, storage);
  return storage;
};

const ok = (data: unknown, message: string, messageCode: string): MockResponse => ({
  data: { status: true, messageCode, message, data },
});

const fail = (status: number, message: string): MockResponse => ({
  status,
  data: { status: false, message },
});

const readFormDataValue = (body: unknown, key: string): string | undefined => {
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    const value = body.get(key);
    return typeof value === 'string' ? value : undefined;
  }
  if (body && typeof body === 'object' && key in body) {
    const value = (body as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : undefined;
  }
  return undefined;
};

const listPayload = (edges: NotificationEdge[]) => ({
  totalCount: edges.length,
  edges,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: edges[0]?.cursor ?? null,
    endCursor: edges[edges.length - 1]?.cursor ?? null,
  },
});

export const notificationMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/notification',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const { edges } = getStorage(adapterStorage);
      return ok(listPayload(edges), 'Notification list fetched successfully', 'NOTIFICATION_S2');
    },
  },
  {
    method: 'GET',
    path: '/notification/',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const { edges } = getStorage(adapterStorage);
      return ok(listPayload(edges), 'Notification list fetched successfully', 'NOTIFICATION_S2');
    },
  },
  {
    method: 'GET',
    path: '/notification-setting',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const { settings } = getStorage(adapterStorage);
      return ok(settings, 'Notification settings fetched successfully', 'NOTIFICATION_SETTING_S1');
    },
  },
  {
    method: 'PUT',
    path: '/notification-setting',
    handler: ({ body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const storage = getStorage(adapterStorage);
      storage.settings = {
        ...storage.settings,
        senderName: readFormDataValue(body, 'senderName') ?? storage.settings.senderName,
        senderEmail: readFormDataValue(body, 'senderEmail') ?? storage.settings.senderEmail,
        buttonBackgroundColor:
          readFormDataValue(body, 'buttonBackgroundColor') ?? storage.settings.buttonBackgroundColor,
        buttonTextColor: readFormDataValue(body, 'buttonTextColor') ?? storage.settings.buttonTextColor,
      };
      return ok(storage.settings, 'Notification settings updated successfully', 'NOTIFICATION_SETTING_S2');
    },
  },
  {
    method: 'PUT',
    path: '/notification-setting/',
    handler: ({ body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const storage = getStorage(adapterStorage);
      storage.settings = {
        ...storage.settings,
        senderName: readFormDataValue(body, 'senderName') ?? storage.settings.senderName,
        senderEmail: readFormDataValue(body, 'senderEmail') ?? storage.settings.senderEmail,
        buttonBackgroundColor:
          readFormDataValue(body, 'buttonBackgroundColor') ?? storage.settings.buttonBackgroundColor,
        buttonTextColor: readFormDataValue(body, 'buttonTextColor') ?? storage.settings.buttonTextColor,
      };
      return ok(storage.settings, 'Notification settings updated successfully', 'NOTIFICATION_SETTING_S2');
    },
  },
  {
    method: 'PATCH',
    path: '/notification/:id',
    handler: ({ params, body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const storage = getStorage(adapterStorage);
      const edge = storage.edges.find((item) => item.node.id === params.id);
      if (!edge) return fail(404, 'Notification not found.');

      const isActive =
        body && typeof body === 'object' && 'isActive' in body
          ? Boolean((body as { isActive: unknown }).isActive)
          : edge.node.isActive;
      edge.node = { ...edge.node, isActive };
      return ok(edge.node, 'Notification updated successfully', 'NOTIFICATION_S3');
    },
  },
  {
    method: 'GET',
    path: '/notification/:id',
    handler: ({ params, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const storage = getStorage(adapterStorage);
      const edge = storage.edges.find((item) => item.node.id === params.id);
      if (!edge) return fail(404, 'Notification not found.');

      const details = getOrCreateDetails(storage, edge.node);
      return ok(details, 'Notification details fetched successfully', 'NOTIFICATION_S4');
    },
  },
  {
    method: 'PUT',
    path: '/notification/:id',
    handler: ({ params, body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const storage = getStorage(adapterStorage);
      const edge = storage.edges.find((item) => item.node.id === params.id);
      if (!edge) return fail(404, 'Notification not found.');

      const details = getOrCreateDetails(storage, edge.node);
      const payload = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

      if (typeof payload.template === 'string') {
        details.template = payload.template;
        details.parsedTemplate = payload.template;
      }
      if (typeof payload.subject === 'string') {
        details.subject = payload.subject;
      }
      if (Array.isArray(payload.cc)) {
        details.cc = payload.cc.filter((item): item is string => typeof item === 'string');
      }
      if (Array.isArray(payload.bcc)) {
        details.bcc = payload.bcc.filter((item): item is string => typeof item === 'string');
      }

      return ok(details, 'Notification updated successfully', 'NOTIFICATION_S5');
    },
  },
  {
    method: 'POST',
    path: '/notification/test',
    handler: ({ adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      return ok({ sent: true }, 'Test email sent successfully', 'NOTIFICATION_S6');
    },
  },
  {
    method: 'POST',
    path: '/notification/preview',
    handler: ({ body, adapterStorage }) => {
      const unauthorized = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorized) return unauthorized;
      const payload = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
      const template = typeof payload.template === 'string' ? payload.template : '<p>Preview</p>';
      const subject = typeof payload.subject === 'string' ? payload.subject : 'Preview';
      return ok({ html: template, subject }, 'Notification preview generated successfully', 'NOTIFICATION_S7');
    },
  },
];
