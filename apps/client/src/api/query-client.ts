import { QueryClient } from '@tanstack/react-query';
import { api } from './client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const path = queryKey[0];
        if (typeof path !== 'string') {
          throw new Error('The first query key must be the request path.');
        }
        const { data } = await api.get(path);
        return data;
      },
    },
  },
});
