export interface HomeInsightCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  previousValue?: string;
  isPositive?: boolean;
  tooltipContent?: string;
}

export interface HomeOnboardingStepProps {
  title: string;
  description: string;
  completed: boolean;
}

export interface HomeFeatureCardProps {
  heading: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  mediaSide: 'left' | 'right';
  mediaWidthPct: number;
  type: 'announcement' | 'default';
  primaryActionLabel: string;
  secondaryActionLabel?: string;
}

export interface HomePartnerCardProps {
  heading: string;
  description: string;
  imageSrc: string;
  primaryActionLabel: string;
}

export interface HomePageDataProps {
  title: string;
  description: string;
  insights: HomeInsightCardProps[];
  onboarding: {
    heading: string;
    description: string;
    steps: HomeOnboardingStepProps[];
  };
  featureCards: HomeFeatureCardProps[];
  partners: {
    title: string;
    description: string;
    cards: HomePartnerCardProps[];
  };
}

/** Mock/API demo states. Pass as `?home=empty` or `?home=error` on the home route. */
export type HomeDemoScenarioProps = 'default' | 'empty' | 'error';

export const parseHomeDemoScenario = (value: string | null): HomeDemoScenarioProps => {
  if (value === 'empty' || value === 'error') return value;
  return 'default';
};
