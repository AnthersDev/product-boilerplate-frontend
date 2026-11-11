import React from 'react';
import {
  Badge,
  Card,
  FeatureCard,
  ImageDescription,
  InsightCards,
  Onboarding,
  PartnerCard,
} from '@marmeto_engineering/anthers-components';
import { ArrowRight, ExternalLink, Link, MessageCircleQuestionMark } from 'lucide-react';

/** Sample sections matching the Anthers HomePage Chromatic story, with generic copy products can replace. */
export const insightCardsData = [
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
];

const onboardingStepContent = (
  <ImageDescription
    imageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
    imageAlt="Team collaboration"
    title="Team setup complete"
    description="Your team has been onboarded with the right permissions."
    primaryAction={{
      content: 'Invite more users',
      onClick: () => undefined,
      variant: 'primary',
      endIcon: <ArrowRight size={16} color="#ffffff" strokeWidth={1.75} />,
    }}
    secondaryAction={{
      content: 'Manage permissions',
      onClick: () => undefined,
      variant: 'default',
    }}
    imagePosition="right"
    mediaWidthPct={40}
  />
);

export const onboardingOptions = [
  {
    content: {
      title: 'Complete your company profile',
      description: 'Set up your organization information and branding',
    },
    completed: true,
    children: onboardingStepContent,
  },
  {
    content: {
      title: 'Connect your data sources',
      description: 'Integrate with your existing tools and platforms',
    },
    completed: false,
    children: onboardingStepContent,
  },
  {
    content: {
      title: 'Invite your team members',
      description: 'Add colleagues and set up user permissions',
    },
    completed: true,
    children: onboardingStepContent,
  },
  {
    content: {
      title: 'Configure your workflows',
      description: 'Set up automation rules and processes',
    },
    completed: false,
    children: onboardingStepContent,
  },
  {
    content: {
      title: 'Start using the platform',
      description: 'Begin your first project and explore features',
    },
    completed: false,
    children: onboardingStepContent,
  },
];

export const featureCardsData = [
  {
    heading: 'New AI-powered analytics dashboard',
    description:
      'Get deeper insights into your business performance. Track KPIs, identify trends, and make data-driven decisions faster.',
    imageAlt: 'Analytics dashboard',
    imageSrc: 'https://images.unsplash.com/photo-1642516303080-431f6681f864?w=400&h=300&fit=crop',
    mediaSide: 'right' as const,
    mediaWidthPct: 20,
    primaryAction: {
      content: 'Explore dashboard',
      endIcon: <ArrowRight size={16} strokeWidth={1.75} />,
      onClick: () => undefined,
      variant: 'primary' as const,
    },
    type: 'announcement' as const,
  },
  {
    heading: '24/7 customer support available',
    description:
      'Need help? Our support team is available around the clock via live chat, email, or a scheduled consultation.',
    imageAlt: 'Customer support',
    imageSrc: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    mediaSide: 'left' as const,
    mediaWidthPct: 40,
    primaryAction: {
      content: 'Get support',
      startIcon: <MessageCircleQuestionMark size={16} strokeWidth={1.75} />,
      onClick: () => undefined,
      variant: 'primary' as const,
    },
    secondaryAction: {
      content: 'Learn more',
      endIcon: <ExternalLink size={16} strokeWidth={1.75} />,
      onClick: () => undefined,
      variant: 'ghost' as const,
    },
    type: 'default' as const,
  },
];

export const partnerCardsData = [
  {
    heading: 'Integrate with Salesforce',
    description: 'Sync contacts, leads, and opportunities in real time.',
    imageSrc: 'https://images.unsplash.com/photo-1507266676777-46909baa101f?w=400&h=300&fit=crop',
    primaryAction: {
      content: 'Connect Salesforce',
      endIcon: <Link size={16} strokeWidth={1.75} />,
      onClick: () => undefined,
      variant: 'primary' as const,
    },
  },
  {
    heading: 'Connect with HubSpot',
    description: 'Automate lead nurturing and track customer journeys.',
    imageSrc: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop',
    primaryAction: {
      content: 'Connect HubSpot',
      endIcon: <Link size={16} strokeWidth={1.75} />,
      onClick: () => undefined,
      variant: 'primary' as const,
    },
  },
];

export const HomePageSections = () => (
  <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {insightCardsData.map((card) => (
        <InsightCards key={card.title} {...card} />
      ))}
    </div>

    <Card className="onboarding-card">
      <Onboarding
        heading="Get started"
        description="Connect your accounts and finish setup to start using the product."
        options={onboardingOptions}
      />
    </Card>

    {featureCardsData.map((card) => (
      <FeatureCard
        key={card.heading}
        description={card.description}
        heading={card.heading}
        imageAlt={card.imageAlt}
        imageSrc={card.imageSrc}
        mediaSide={card.mediaSide}
        mediaWidthPct={card.mediaWidthPct}
        primaryAction={card.primaryAction}
        secondaryAction={'secondaryAction' in card ? card.secondaryAction : undefined}
        type={card.type}
      />
    ))}

    <PartnerCard
      onViewMoreIntegrations={() => undefined}
      title="Enhance your workflow with powerful integrations"
      description="Connect with your favourite tools and platforms to streamline your workflow."
      badges={[
        <Badge key="popular" color="info" size="small">
          <span>Popular Integrations</span>
        </Badge>,
      ]}
      partnerCardsData={partnerCardsData}
    />
  </>
);
