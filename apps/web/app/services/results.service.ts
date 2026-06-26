import type { HistoryResponse, SingleResultResponse, EnqueueResponse } from '@repo/types';
import { useApi } from '../lib/api';

export function useResultsService() {
  const { fetchFromApi } = useApi();

  const fetchResultsHistory = () => {
    return fetchFromApi<HistoryResponse>('/results/history');
  };

  const fetchResultById = (id: string) => {
    return fetchFromApi<SingleResultResponse>(`/results/${id}`);
  };

  const enqueueAnalysis = (formData: FormData) => {
    return fetchFromApi<EnqueueResponse>('/resume/analyze', {
      method: 'POST',
      body: formData,
    });
  };

  return {
    fetchResultsHistory,
    fetchResultById,
    enqueueAnalysis,
  };
}
