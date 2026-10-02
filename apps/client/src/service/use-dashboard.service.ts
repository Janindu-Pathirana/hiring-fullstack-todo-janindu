import { useQuery } from '@tanstack/react-query';
import type { IDashboardCounts } from '@hiring-fullstack-todo-janindu/shared-types';

export type DashboardCountsResponse = {
  message: string;
  counts: IDashboardCounts;
};

export function useDashboardCounts() {
  return useQuery<DashboardCountsResponse>({
    queryKey: ['/api/dashboard'],
  });
}
