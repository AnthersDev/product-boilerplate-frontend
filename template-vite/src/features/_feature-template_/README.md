# Feature Template

Copy this folder when you add a domain. It is not a screen in the app.

The sample is a real `GET /examples` call. Copy this shape, then rename it:

- `services/example-service.ts` calls `httpClient` and exports React Query options
- `hooks/use-example.ts` is `useQuery(examplesQueryOptions())`
- `services/example-mock.ts` returns the `{ status, message, data }` envelope
- `components/ExampleComponent.tsx` renders pending, error, and success from that hook

Do not replace this with `useState` plus a function that returns a string. Server data stays in React Query.

## After you copy

1. Rename the folder, types, query key, endpoint, and mock path.
2. In `src/services/mocks/handlers.ts`, import your routes instead of `exampleMockRoutes` from this folder.
3. Export only through `index.ts`. Pages import from `@/features/<domain>`, not from files inside the feature.

## Project structure

See [Project structure](../../../docs/PROJECT_STRUCTURE.md).

## What this folder exports

- `ExampleComponent` renders the example list
- `useExample` loads it
- `fetchExamples`, `examplesQueryOptions`, and `exampleQueryKeys` are the service
- `exampleMockRoutes` is the mock handler, registered in `src/services/mocks/handlers.ts`
- `ExampleItem` is the response item
