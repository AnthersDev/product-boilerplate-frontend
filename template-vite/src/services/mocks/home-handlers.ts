import type { HomePageDataProps } from '@/features/home';

import { getUnauthorizedSessionResponse } from './auth-handlers';
import type { MockResponse, MockRoute } from './types';

const ok = (data: unknown, message?: string): MockResponse => ({ data: { status: true, message, data } });
const fail = (status: number, message: string): MockResponse => ({ status, data: { status: false, message } });

const FULL_HOME: HomePageDataProps = {
  title: 'Welcome',
  description: 'Your unified workspace overview. Replace these sections with your product’s home content.',
  insights: [
    {
      title: 'Revenue',
      value: '$1,000,000',
      percentageChange: 10.5,
      previousValue: '$900,000',
      isPositive: true,
      tooltipContent: 'Total revenue for the last quarter.',
    },
    {
      title: 'Profit',
      value: '$250,000',
      previousValue: '$320,000',
      percentageChange: -5.2,
      isPositive: false,
      tooltipContent: 'Total profit for the last quarter.',
    },
    {
      title: 'Active Users',
      value: '1,200',
      previousValue: '1,300',
      percentageChange: 15,
      isPositive: true,
    },
    {
      title: 'Churn Rate',
      value: '2.5%',
      previousValue: '3.0%',
      percentageChange: -0.5,
      isPositive: true,
      tooltipContent: 'Percentage of users who unsubscribed last quarter.',
    },
  ],
  onboarding: {
    heading: 'Get started',
    description: 'Connect your accounts and finish setup to start using the product.',
    steps: [
      {
        title: 'Complete your company profile',
        description: 'Set up your organization information and branding',
        completed: true,
      },
      {
        title: 'Connect your data sources',
        description: 'Integrate with your existing tools and platforms',
        completed: false,
      },
      {
        title: 'Invite your team members',
        description: 'Add colleagues and set up user permissions',
        completed: true,
      },
      {
        title: 'Configure your workflows',
        description: 'Set up automation rules and processes',
        completed: false,
      },
      {
        title: 'Start using the platform',
        description: 'Begin your first project and explore features',
        completed: false,
      },
    ],
  },
  featureCards: [
    {
      heading: 'New AI-powered analytics dashboard',
      description:
        'Get deeper insights into your business performance. Track KPIs, identify trends, and make data-driven decisions faster.',
      imageAlt: 'Analytics dashboard',
      imageSrc: 'https://images.unsplash.com/photo-1642516303080-431f6681f864?w=400&h=300&fit=crop',
      mediaSide: 'right',
      mediaWidthPct: 20,
      type: 'announcement',
      primaryActionLabel: 'Explore dashboard',
    },
    {
      heading: '24/7 customer support available',
      description:
        'Need help? Our support team is available around the clock via live chat, email, or a scheduled consultation.',
      imageAlt: 'Customer support',
      imageSrc: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      mediaSide: 'left',
      mediaWidthPct: 40,
      type: 'default',
      primaryActionLabel: 'Get support',
      secondaryActionLabel: 'Learn more',
    },
  ],
  partners: {
    title: 'Enhance your workflow with powerful integrations',
    description: 'Connect with your favourite tools and platforms to streamline your workflow.',
    cards: [
      {
        heading: 'Integrate with Salesforce',
        description: 'Sync contacts, leads, and opportunities in real time.',
        imageSrc: 'https://images.unsplash.com/photo-1507266676777-46909baa101f?w=400&h=300&fit=crop',
        primaryActionLabel: 'Connect Salesforce',
      },
      {
        heading: 'Connect with HubSpot',
        description: 'Automate lead nurturing and track customer journeys.',
        imageSrc: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop',
        primaryActionLabel: 'Connect HubSpot',
      },
    ],
  },
};

const EMPTY_HOME: HomePageDataProps = {
  title: 'Welcome',
  description: 'Nothing to show yet. Finish setup or connect a data source to populate this page.',
  insights: [],
  onboarding: {
    heading: 'Get started',
    description: 'Complete the steps below to unlock your workspace overview.',
    steps: [],
  },
  featureCards: [],
  partners: {
    title: 'Integrations',
    description: 'Partner integrations will appear here once they are available for your plan.',
    cards: [],
  },
};

export const homeMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/home',
    handler: ({ query, adapterStorage }) => {
      const unauthorizedResponse = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorizedResponse) return unauthorizedResponse;

      const scenario = query.get('scenario');
      if (scenario === 'error') {
        return fail(500, 'Could not load the home page.');
      }
      if (scenario === 'empty') {
        return ok(EMPTY_HOME);
      }
      return ok(FULL_HOME);
    },
  },
];
