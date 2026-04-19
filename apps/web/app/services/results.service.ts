import { fetchFromApi } from '../lib/api';
import type { HistoryResponse, SingleResultResponse } from '@repo/types';

export async function fetchResultsHistory(): Promise<HistoryResponse> {
  return fetchFromApi<HistoryResponse>('/results/history');
}

export async function fetchResultById(id: string): Promise<SingleResultResponse> {
  return fetchFromApi<SingleResultResponse>(`/results/${id}`);
}
