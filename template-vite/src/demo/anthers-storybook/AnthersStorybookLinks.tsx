import React from 'react';
/** Storybook: Button — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-actions-button--docs */
import { Button } from '@marmeto_engineering/anthers-components';
import { BookOpen, ExternalLink } from 'lucide-react';

import { ANTHERS_STORYBOOK_LINKS, type AnthersStorybookComponent } from './links';

export interface AnthersStorybookLinksProps {
  /** Anthers components used on this screen — each becomes a Storybook button. */
  components: AnthersStorybookComponent[];
  className?: string;
}

/**
 * Demo-only clickable Storybook shortcuts. Wrapped with
 * `{/* @clean-demo anthers-storybook *\/}` … `{/* @clean-demo-end *\/}`
 * and removed by `npm run clean:demo`.
 */
export const AnthersStorybookLinks = ({ components, className = '' }: AnthersStorybookLinksProps) => {
  if (components.length === 0) return null;

  return (
    <aside
      role="note"
      aria-label="Anthers Storybook documentation links for this screen"
      className={`rounded-md border border-dashed border-sky-300 bg-sky-50 px-3 py-2.5 text-sky-950 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <p className="text-small inline-flex items-center gap-1.5 font-semibold">
            <BookOpen size={14} strokeWidth={1.75} aria-hidden />
            Anthers component docs
          </p>
          <p className="text-small mt-0.5 text-sky-900/80">
            Opens this screen&apos;s Anthers components in Chromatic Storybook (props, variants, examples). Demo only —
            removed by <code className="rounded bg-sky-100 px-1">npm run clean:demo</code>.
          </p>
        </div>
      </div>

      <div
        className="mt-2 flex flex-wrap items-center gap-2"
        role="navigation"
        aria-label="Open Storybook for each component"
      >
        {components.map((name) => (
          <Button
            key={name}
            size="small"
            variant="outline"
            href={ANTHERS_STORYBOOK_LINKS[name]}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${name} in Anthers Storybook (new tab)`}
            endIcon={<ExternalLink size={12} strokeWidth={1.75} aria-hidden />}
            className="bg-white"
            data-attr={`storybook-${name}`}
          >
            Open {name}
          </Button>
        ))}
      </div>
    </aside>
  );
};
