import { useCallback, useState } from 'react';

import type { ExampleService, ExampleState } from '../types';

export const useExample = (): ExampleState & ExampleService => {
  const [state, setState] = useState<ExampleState>({ value: '', isLoading: false, error: null });

  const doSomething = useCallback(async (value: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      setState({ value, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      }));
    }
  }, []);

  return { ...state, doSomething };
};
