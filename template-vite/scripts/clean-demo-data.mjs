import { log } from 'node:console';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { argv, exit } from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isDryRun = argv.includes('--dry-run');

const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8');

const STORYBOOK_DEMO_START = '{/* @clean-demo anthers-storybook */}';
const STORYBOOK_DEMO_END = '{/* @clean-demo-end */}';
const storybookDemoDir = 'src/demo/anthers-storybook';

/** Pages/features that mount clickable Anthers Storybook demo buttons. */
const storybookUsagePaths = [
  'src/pages/Home.tsx',
  'src/features/home/home-page-content.tsx',
  'src/pages/registration/Registration.tsx',
  'src/pages/analytics/Reports.tsx',
  'src/pages/settings/Settings.tsx',
  'src/pages/settings/user-management/UsersList.tsx',
  'src/pages/settings/user-management/AddUser.tsx',
  'src/pages/settings/user-management/UserDetails.tsx',
  'src/pages/settings/notifications/Notifications.tsx',
  'src/pages/settings/notifications/NotificationDetail.tsx',
  'src/pages/WhatsNew.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/auth/Login.tsx',
  'src/pages/auth/SelectOrganization.tsx',
  'src/pages/permissions/PermissionsOverview.tsx',
  'src/pages/permissions/PermissionsAllowed.tsx',
  'src/pages/permissions/PermissionsAccessDenied.tsx',
  'src/pages/permissions/PermissionsHidden.tsx',
];

const stripAnthersStorybookDemo = (source, relativePath) => {
  let result = source;
  while (result.includes(STORYBOOK_DEMO_START)) {
    const start = result.indexOf(STORYBOOK_DEMO_START);
    const nextStart = result.indexOf(STORYBOOK_DEMO_START, start + STORYBOOK_DEMO_START.length);
    const end = result.indexOf(STORYBOOK_DEMO_END, start);
    if (end === -1) {
      throw new Error(`Missing ${STORYBOOK_DEMO_END} in ${relativePath}. No files were changed.`);
    }
    if (nextStart !== -1 && nextStart < end) {
      throw new Error(`Found nested ${STORYBOOK_DEMO_START} in ${relativePath}. No files were changed.`);
    }

    const startLine = result.lastIndexOf('\n', start - 1) + 1;
    const removeStart = result.slice(startLine, start).trim() === '' ? startLine : start;
    const endAfterMarker = end + STORYBOOK_DEMO_END.length;
    const endLineBreak = result.indexOf('\n', endAfterMarker);
    const endLine = result.slice(endAfterMarker, endLineBreak === -1 ? result.length : endLineBreak);
    const removeEnd = endLine.trim() === '' ? (endLineBreak === -1 ? result.length : endLineBreak + 1) : endAfterMarker;

    result = `${result.slice(0, removeStart)}${result.slice(removeEnd)}`;
  }

  result = result.replace(/^import \{ AnthersStorybookLinks \} from '@\/demo\/anthers-storybook';\r?\n/gm, '');
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
};

const replaceOnce = (source, before, after, relativePath, alreadyCleanMarker = after) => {
  const first = source.indexOf(before);
  if (first === -1) {
    if (alreadyCleanMarker && source.includes(alreadyCleanMarker)) return source;
    throw new Error(`Could not find expected source section in ${relativePath}. No files were changed.`);
  }
  if (source.indexOf(before, first + before.length) !== -1) {
    throw new Error(`Found multiple matching source sections in ${relativePath}. No files were changed.`);
  }
  return `${source.slice(0, first)}${after}${source.slice(first + before.length)}`;
};

const replaceSection = (source, startMarker, endMarker, replacement, relativePath, alreadyCleanMarker) => {
  const start = source.indexOf(startMarker);
  if (start === -1) {
    if (alreadyCleanMarker && source.includes(alreadyCleanMarker)) return source;
    throw new Error(`Could not find expected source section in ${relativePath}. No files were changed.`);
  }
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    throw new Error(`Could not find the end of a source section in ${relativePath}. No files were changed.`);
  }
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
};

const replaceToEnd = (source, startMarker, replacement, relativePath, alreadyCleanMarker) => {
  const start = source.indexOf(startMarker);
  if (start === -1) {
    if (alreadyCleanMarker && source.includes(alreadyCleanMarker)) return source;
    throw new Error(`Could not find expected source section in ${relativePath}. No files were changed.`);
  }
  return `${source.slice(0, start)}${replacement}`;
};

/** Collect transforms per path so overlapping clean steps (e.g. Home + Storybook) compose. */
const transformPipeline = new Map();

const update = (relativePath, transform) => {
  const transforms = transformPipeline.get(relativePath) ?? [];
  transforms.push(transform);
  transformPipeline.set(relativePath, transforms);
};

const reportHandlersPath = 'src/services/mocks/reports-handlers.ts';
const homeHandlersPath = 'src/services/mocks/home-handlers.ts';
const homeHookPath = 'src/features/home/hooks/use-home.ts';
const homeTypesPath = 'src/features/home/types.ts';
const homeServicePath = 'src/features/home/services/home-service.ts';
const homeIndexPath = 'src/features/home/index.ts';
const homePagePath = 'src/pages/Home.tsx';
const homeContentPath = 'src/features/home/home-page-content.tsx';
const registrationFormPath = 'src/pages/registration/vendor-registration-form.ts';
const readmePath = 'README.md';

const cleanRegistrationForm = `/** Empty registration form after \`npm run clean:demo\`. Load your product form JSON here. */
export const vendorRegistrationSampleForm = {
  sections: [],
};
`;

const cleanHomeHook = `import { useQuery } from '@tanstack/react-query';

import { homePageQueryOptions } from '../services/home-service';

export const useHomePage = () => useQuery(homePageQueryOptions());
`;

update(reportHandlersPath, (source) => {
  let result = replaceSection(
    source,
    'const ORDERS: ReportOrderNode[] = [',
    'const REPORT_FILTERS = [',
    'const ORDERS: ReportOrderNode[] = [];\n\n',
    reportHandlersPath,
    'const ORDERS: ReportOrderNode[] = [];',
  );
  result = replaceSection(
    result,
    'const DEFAULT_VIEWS: SavedFilterView[] = [',
    'const ok =',
    'const DEFAULT_VIEWS: SavedFilterView[] = [];\n\n',
    reportHandlersPath,
    'const DEFAULT_VIEWS: SavedFilterView[] = [];',
  );
  return result;
});

update(homeHandlersPath, (source) => {
  let result = replaceOnce(
    source,
    'const fail = (status: number, message: string): MockResponse => ({ status, data: { status: false, message } });\n',
    '',
    homeHandlersPath,
    'handler: ({ adapterStorage }) => {',
  );
  result = replaceSection(
    result,
    'const EMPTY_HOME: HomePageDataProps = {',
    'export const homeMockRoutes:',
    '',
    homeHandlersPath,
    'handler: ({ adapterStorage }) => {',
  );
  result = replaceToEnd(
    result,
    'export const homeMockRoutes:',
    `export const homeMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/home',
    handler: ({ adapterStorage }) => {
      const unauthorizedResponse = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorizedResponse) return unauthorizedResponse;
      return ok(FULL_HOME);
    },
  },
];
`,
    homeHandlersPath,
    'handler: ({ adapterStorage }) => {',
  );
  return result;
});

update(homeHookPath, (source) => {
  if (!source.includes('useHomeDemoScenario')) {
    if (source === cleanHomeHook) return source;
    throw new Error(`Unexpected contents in ${homeHookPath}. No files were changed.`);
  }
  return cleanHomeHook;
});

update(homeTypesPath, (source) => {
  const result = replaceToEnd(
    source,
    '/** Mock/API demo states.',
    '',
    homeTypesPath,
    'export interface HomePageDataProps',
  );
  return `${result.trimEnd()}\n`;
});

update(homeServicePath, (source) => {
  let result = replaceOnce(
    source,
    "import type { HomeDemoScenarioProps, HomePageDataProps } from '../types';",
    "import type { HomePageDataProps } from '../types';",
    homeServicePath,
    "import type { HomePageDataProps } from '../types';",
  );
  result = replaceOnce(
    result,
    '  page: (scenario: HomeDemoScenarioProps) => [...homeQueryKeys.all, scenario] as const,',
    "  page: () => [...homeQueryKeys.all, 'page'] as const,",
    homeServicePath,
    "  page: () => [...homeQueryKeys.all, 'page'] as const,",
  );
  result = replaceOnce(
    result,
    `export const fetchHomePage = async (scenario: HomeDemoScenarioProps = 'default') => {
  const { data } = await httpClient.get<ApiEnvelope<HomePageDataProps>>(HOME_ENDPOINT, {
    params: scenario === 'default' ? undefined : { scenario },
  });
  return data.data;
};`,
    `export const fetchHomePage = async () => {
  const { data } = await httpClient.get<ApiEnvelope<HomePageDataProps>>(HOME_ENDPOINT);
  return data.data;
};`,
    homeServicePath,
    'export const fetchHomePage = async () =>',
  );
  return replaceOnce(
    result,
    `export const homePageQueryOptions = (scenario: HomeDemoScenarioProps = 'default') =>
  queryOptions({
    queryKey: homeQueryKeys.page(scenario),
    queryFn: () => fetchHomePage(scenario),
  });`,
    `export const homePageQueryOptions = () =>
  queryOptions({
    queryKey: homeQueryKeys.page(),
    queryFn: fetchHomePage,
  });`,
    homeServicePath,
    'queryKey: homeQueryKeys.page(),',
  );
});

update(homeIndexPath, (source) => {
  let result = replaceOnce(
    source,
    "export { useHomeDemoScenario, useHomePage } from './hooks/use-home';",
    "export { useHomePage } from './hooks/use-home';",
    homeIndexPath,
    "export { useHomePage } from './hooks/use-home';",
  );
  return replaceOnce(
    result,
    '  parseHomeDemoScenario,\n  type HomeDemoScenarioProps,\n',
    '',
    homeIndexPath,
    'type HomePageDataProps',
  );
});

update(homePagePath, (source) => {
  let result = replaceOnce(
    source,
    "import { Link } from 'react-router-dom';\n",
    '',
    homePagePath,
    "import { useSession } from '@/features/auth';",
  );
  result = replaceOnce(
    result,
    "import { HomePageLoading, HomePageSections, useHomeDemoScenario, useHomePage } from '@/features/home';",
    "import { HomePageLoading, HomePageSections, useHomePage } from '@/features/home';",
    homePagePath,
    "import { HomePageLoading, HomePageSections, useHomePage } from '@/features/home';",
  );
  result = replaceOnce(result, "import { env } from '@/libs/env';\n", '', homePagePath, 'const home = useHomePage();');
  result = replaceOnce(
    result,
    '  const scenario = useHomeDemoScenario();\n',
    '',
    homePagePath,
    'const home = useHomePage();',
  );
  result = replaceSection(
    result,
    '      {env.useMockApi && (',
    '      {home.isPending',
    '',
    homePagePath,
    'const home = useHomePage();',
  );
  return result;
});

update(homeContentPath, (source) => {
  let result = replaceOnce(
    source,
    `        actions={
          env.useMockApi ? (
            <Button variant="outline" onClick={() => navigate('/?home=default')}>
              Load sample data
            </Button>
          ) : undefined
        }
`,
    '',
    homeContentPath,
    '<StatusScreen',
  );
  return replaceOnce(
    result,
    `    return (
      <StatusScreen
        title="Nothing on your home page yet"
        description={data.description}
      />
    );`,
    '    return <StatusScreen title="Nothing on your home page yet" description={data.description} />;',
    homeContentPath,
    'export const HomePageSections',
  );
});

update(registrationFormPath, (source) => {
  if (!source.includes("id: 'company'") && source.includes('sections: []')) {
    return source.includes('Empty registration form after') ? source : cleanRegistrationForm;
  }
  if (source.trim() === cleanRegistrationForm.trim()) return source;
  return cleanRegistrationForm;
});

update(readmePath, (source) => {
  let result = source;
  const demoDescription = 'Home (Anthers shell). Mock demos: `?home=empty`, `?home=error`';
  if (result.includes(demoDescription)) {
    result = replaceOnce(result, demoDescription, 'Home (Anthers shell)', readmePath, 'Home (Anthers shell)');
  }

  const registrationDemo =
    'Vendor registration demo (`FormPreviewPage` multi-section sample: Company → Brand → Bank → Contact)';
  if (result.includes(registrationDemo)) {
    result = replaceOnce(
      result,
      registrationDemo,
      'Vendor registration (`FormPreviewPage`; sample sections cleared by `npm run clean:demo`)',
      readmePath,
      'sample sections cleared by',
    );
  }

  const storybookUiNotes = [
    'In the running app, dashed **Storybook** button bars sit near Anthers usages (open Chromatic in a new tab). They ship from `src/demo/anthers-storybook` and are removed by `npm run clean:demo`.',
    'In the running app, dashed **Anthers component docs** bars sit near Anthers usages. Each button opens that component in Chromatic Storybook (new tab). Copy explains they are demo-only and removed by `npm run clean:demo`. Source: `src/demo/anthers-storybook`.',
  ];
  for (const storybookUiNote of storybookUiNotes) {
    if (result.includes(storybookUiNote)) {
      result = replaceOnce(result, `${storybookUiNote}\n\n`, '', readmePath, 'docs/anthers-storybook.md');
    }
  }

  const optionalStorybookBarInstruction =
    'For a clickable demo bar, wrap `<AnthersStorybookLinks components={[...]} />` in `{/* @clean-demo anthers-storybook */}` … `{/* @clean-demo-end */}` markers.';
  if (result.includes(optionalStorybookBarInstruction)) {
    result = replaceOnce(result, ` ${optionalStorybookBarInstruction}`, '', readmePath, 'docs/anthers-storybook.md');
  }

  const storybookCleanupInstruction =
    'When adding an Anthers Storybook demo bar to a page, register that page in `storybookUsagePaths` in `scripts/clean-demo-data.mjs`; the `@clean-demo` markers alone do not register a page for cleanup.';
  if (result.includes(storybookCleanupInstruction)) {
    result = replaceOnce(result, `${storybookCleanupInstruction}\n\n`, '', readmePath, 'npm run clean:demo');
  }

  const cleanDemoScripts =
    'Strip demo mock data, homepage demo controls, registration sample form fields, and on-page Anthers Storybook buttons';
  if (result.includes(cleanDemoScripts)) {
    result = replaceOnce(
      result,
      cleanDemoScripts,
      'Strip demo mock data, homepage demo controls, and registration sample form fields',
      readmePath,
      'Strip demo mock data, homepage demo controls, and registration sample form fields',
    );
  }

  return result;
});

storybookUsagePaths.forEach((relativePath) => {
  update(relativePath, (source) => stripAnthersStorybookDemo(source, relativePath));
});

const storybookDemoAbs = path.join(root, storybookDemoDir);
const willRemoveStorybookDemo = existsSync(storybookDemoAbs);

const changed = [...transformPipeline.entries()]
  .map(([relativePath, transforms]) => {
    let content = read(relativePath);
    for (const transform of transforms) {
      content = transform(content);
    }
    return [relativePath, content];
  })
  .filter(([relativePath, content]) => content !== read(relativePath));

if (changed.length === 0 && !willRemoveStorybookDemo) {
  log('Demo data is already cleaned.');
  exit(0);
}

if (isDryRun) {
  log('The following files would be updated:');
  changed.forEach(([relativePath]) => log(`- ${relativePath}`));
  if (willRemoveStorybookDemo) log(`- (delete) ${storybookDemoDir}/`);
  exit(0);
}

for (const [relativePath, content] of changed) {
  writeFileSync(path.join(root, relativePath), content);
}

if (willRemoveStorybookDemo) {
  rmSync(storybookDemoAbs, { recursive: true, force: true });
  const demoParent = path.join(root, 'src/demo');
  if (existsSync(demoParent) && readdirSync(demoParent).length === 0) {
    rmSync(demoParent, { recursive: true, force: true });
  }
}

log(
  `Cleaned demo report data, homepage states, registration sample form, and Anthers Storybook UI links in ${changed.length} file(s)${willRemoveStorybookDemo ? ` (removed ${storybookDemoDir})` : ''}.`,
);
