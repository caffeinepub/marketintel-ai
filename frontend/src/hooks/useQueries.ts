import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AnalysisRecord } from '../backend';

export function useGetAnalysisHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<AnalysisRecord[]>({
    queryKey: ['analysisHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnalysisHistory();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return query;
}

export function useSaveAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: AnalysisRecord) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveAnalysis(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisHistory'] });
    },
  });
}
