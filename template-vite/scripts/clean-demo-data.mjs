import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isDryRun = process.argv.includes('--dry-run');

const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8');

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

const update = (relativePath, transform) => [relativePath, transform(read(relativePath))];

const reportHandlersPath = 'src/services/mocks/reports-handlers.ts';
const homeHandlersPath = 'src/services/mocks/home-handlers.ts';
const homeHookPath = 'src/features/home/hooks/use-home.ts';
const homeTypesPath = 'src/features/home/types.ts';
const homeServicePath = 'src/features/home/services/home-service.ts';
const homeIndexPath = 'src/features/home/index.ts';
const homePagePath = 'src/pages/Home.tsx';
const homeContentPath = 'src/features/home/home-page-content.tsx';
const readmePath = 'README.md';

const cleanHomeHook = `import { useQuery } from '@tanstack/react-query';

import { homePageQueryOptions } from '../services/home-service';

export const useHomePage = () => useQuery(homePageQueryOptions());
`;

const changes = [
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
  }),
  update(homeHandlersPath, (source) => {
    let result = replaceOnce(
      source,
      "const fail = (status: number, message: string): MockResponse => ({ status, data: { status: false, message } });\n",
      '',
      homeHandlersPath,
      'handler: () => ok(FULL_HOME)',
    );
    result = replaceSection(
      result,
      'const EMPTY_HOME: HomePageDataProps = {',
      'export const homeMockRoutes:',
      '',
      homeHandlersPath,
      'handler: () => ok(FULL_HOME)',
    );
    return replaceToEnd(
      result,
      'export const homeMockRoutes:',
      `export const homeMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/home',
    handler: () => ok(FULL_HOME),
  },
];
`,
      homeHandlersPath,
      'handler: () => ok(FULL_HOME)',
    );
  }),
  update(homeHookPath, (source) => {
    if (!source.includes('useHomeDemoScenario')) {
      if (source === cleanHomeHook) return source;
      throw new Error(`Unexpected contents in ${homeHookPath}. No files were changed.`);
    }
    return cleanHomeHook;
  }),
  update(homeTypesPath, (source) =>
    replaceToEnd(
      source,
      '/** Mock/API demo states.',
      '',
      homeTypesPath,
      'export interface HomePageDataProps',
    ),
  ),
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
      "  page: (scenario: HomeDemoScenarioProps) => [...homeQueryKeys.all, scenario] as const,",
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
  }),
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
  }),
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
    result = replaceOnce(
      result,
      "import { env } from '@/libs/env';\n",
      '',
      homePagePath,
      'const home = useHomePage();',
    );
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
      '\n\n      {home.isPending',
      '',
      homePagePath,
      'const home = useHomePage();',
    );
    return result;
  }),
  update(homeContentPath, (source) => {
    let result = replaceOnce(
      source,
      '  Button,\n',
      '',
      homeContentPath,
      'export const HomePageSections',
    );
    result = replaceOnce(
      result,
      "import { useNavigate } from 'react-router-dom';\n",
      '',
      homeContentPath,
      'export const HomePageSections',
    );
    result = replaceOnce(
      result,
      "import { env } from '@/libs/env';\n",
      '',
      homeContentPath,
      'export const HomePageSections',
    );
    result = replaceOnce(
      result,
      '  const navigate = useNavigate();\n',
      '',
      homeContentPath,
      'const hasInsights',
    );
    return replaceOnce(
      result,
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
  }),
  update(readmePath, (source) =>
    replaceOnce(
      source,
      '| `/`                   | Signed-in users with an organization | Home page in the Anthers `AppLayout` shell. Mock demo states: `?home=empty`, `?home=error`. |',
      '| `/`                   | Signed-in users with an organization | Home page in the Anthers `AppLayout` shell.                             |',
      readmePath,
      '| `/`                   | Signed-in users with an organization | Home page in the Anthers `AppLayout` shell.                             |',
    ),
  ),
];

const changed = changes.filter(([relativePath, content]) => content !== read(relativePath));

if (changed.length === 0) {
  console.log('Demo data is already cleaned.');
  process.exit(0);
}

if (isDryRun) {
  console.log('The following files would be updated:');
  changed.forEach(([relativePath]) => console.log(`- ${relativePath}`));
  process.exit(0);
}

for (const [relativePath, content] of changed) {
  writeFileSync(path.join(root, relativePath), content);
}

console.log(`Cleaned demo report data and homepage states in ${changed.length} files.`);
