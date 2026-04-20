import type { HistoryResponse, SingleResultResponse } from '@repo/types';
import { useApi } from '../lib/api';

export function useResultsService() {
  const { fetchFromApi } = useApi();

  const fetchResultsHistory = () => {
    return fetchFromApi<HistoryResponse>('/results/history');
  };

  const fetchResultById = (id: string) => {
    return fetchFromApi<SingleResultResponse>(`/results/${id}`);
  };

  return {
    fetchResultsHistory,
    fetchResultById,
  };
}
