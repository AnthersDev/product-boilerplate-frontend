import React from 'react';
import {
  Badge,
  Button,
  Card,
  FeatureCard,
  ImageDescription,
  InsightCards,
  LoadingState,
  Onboarding,
  PartnerCard,
} from '@marmeto_engineering/anthers-components';
import { ArrowRight, ExternalLink, Link, MessageCircleQuestionMark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { StatusScreen } from '@/components/StatusScreen';
import { env } from '@/libs/env';

import type { HomePageDataProps } from './types';

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

export const HomePageLoading = () => (
  <div className="space-y-6" role="status" aria-label="Loading home page">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {Array.from({ length: 4 }, (_, index) => (
        <LoadingState key={index} variant="insight-card" />
      ))}
    </div>
    <LoadingState variant="page" className="min-h-48 w-full" />
    <LoadingState variant="cardList" className="min-h-40 w-full" />
  </div>
);

export const HomePageSections = ({ data }: { data: HomePageDataProps }) => {
  const navigate = useNavigate();
  const hasInsights = data.insights.length > 0;
  const hasOnboarding = data.onboarding.steps.length > 0;
  const hasFeatures = data.featureCards.length > 0;
  const hasPartners = data.partners.cards.length > 0;
  const isEmpty = !hasInsights && !hasOnboarding && !hasFeatures && !hasPartners;

  if (isEmpty) {
    return (
      <StatusScreen
        title="Nothing on your home page yet"
        description={data.description}
        actions={
          env.useMockApi ? (
            <Button variant="outline" onClick={() => navigate('/?home=default')}>
              Load sample data
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      {hasInsights && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {data.insights.map((card) => (
            <InsightCards key={card.title} {...card} />
          ))}
        </div>
      )}

      {hasOnboarding && (
        <Card className="onboarding-card">
          <Onboarding
            heading={data.onboarding.heading}
            description={data.onboarding.description}
            options={data.onboarding.steps.map((step) => ({
              content: { title: step.title, description: step.description },
              completed: step.completed,
              children: onboardingStepContent,
            }))}
          />
        </Card>
      )}

      {hasFeatures &&
        data.featureCards.map((card) => (
          <FeatureCard
            key={card.heading}
            description={card.description}
            heading={card.heading}
            imageAlt={card.imageAlt}
            imageSrc={card.imageSrc}
            mediaSide={card.mediaSide}
            mediaWidthPct={card.mediaWidthPct}
            type={card.type}
            primaryAction={{
              content: card.primaryActionLabel,
              onClick: () => undefined,
              variant: 'primary',
              endIcon: <ArrowRight size={16} strokeWidth={1.75} />,
            }}
            secondaryAction={
              card.secondaryActionLabel
                ? {
                    content: card.secondaryActionLabel,
                    onClick: () => undefined,
                    variant: 'ghost',
                    endIcon:
                      card.secondaryActionLabel === 'Learn more' ? (
                        <ExternalLink size={16} strokeWidth={1.75} />
                      ) : (
                        <MessageCircleQuestionMark size={16} strokeWidth={1.75} />
                      ),
                  }
                : undefined
            }
          />
        ))}

      {hasPartners && (
        <PartnerCard
          onViewMoreIntegrations={() => undefined}
          title={data.partners.title}
          description={data.partners.description}
          badges={[
            <Badge key="popular" color="info" size="small">
              <span>Popular Integrations</span>
            </Badge>,
          ]}
          partnerCardsData={data.partners.cards.map((card) => ({
            heading: card.heading,
            description: card.description,
            imageSrc: card.imageSrc,
            primaryAction: {
              content: card.primaryActionLabel,
              endIcon: <Link size={16} strokeWidth={1.75} />,
              onClick: () => undefined,
              variant: 'primary' as const,
            },
          }))}
        />
      )}
    </>
  );
};
