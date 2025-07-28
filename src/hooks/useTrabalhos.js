import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as trabalhoService from '@/services/trabalhoService';
import SemanaUtils from '@/utils/semanaUtils';

// Chaves para identificar as queries
export const TRABALHOS_QUERY_KEY = 'trabalhos';
export const RESUMO_SEMANA_QUERY_KEY = 'resumo-semana-trabalhos';
export const RESUMO_MES_QUERY_KEY = 'resumo-mes-trabalhos';

/**
 * Hook para buscar os trabalhos da semana atual
 */
export const useTrabalhosSemana = () => {
  return useQuery({
    queryKey: [RESUMO_SEMANA_QUERY_KEY],
    queryFn: async () => {
      const { inicio, fim } = SemanaUtils.getInicioFimSemana();
      return await trabalhoService.getTrabalhosPorPeriodo(inicio, fim);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};

/**
 * Hook para buscar os trabalhos da semana anterior
 */
export const useTrabalhosSemanaAnterior = () => {
  return useQuery({
    queryKey: [RESUMO_SEMANA_QUERY_KEY, 'anterior'],
    queryFn: async () => {
      const { inicio, fim } = SemanaUtils.getInicioFimSemanaAnterior();
      return await trabalhoService.getTrabalhosPorPeriodo(inicio, fim);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};

/**
 * Hook para buscar os trabalhos do mês atual
 */
export const useTrabalhosMes = () => {
  return useQuery({
    queryKey: [RESUMO_MES_QUERY_KEY],
    queryFn: async () => {
      const { inicio, fim } = SemanaUtils.getInicioFimMes();
      return await trabalhoService.getTrabalhosPorPeriodo(inicio, fim);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};

/**
 * Hook para buscar todos os trabalhos
 */
export const useTrabalhos = () => {
  return useQuery({
    queryKey: [TRABALHOS_QUERY_KEY],
    queryFn: trabalhoService.getTrabalhos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar um trabalho específico
 */
export const useTrabalho = (id) => {
  return useQuery({
    queryKey: [TRABALHOS_QUERY_KEY, id],
    queryFn: () => trabalhoService.getTrabalhoById(id),
    enabled: !!id, // Só executa se o ID existir
  });
};

/**
 * Hook para adicionar um novo trabalho
 */
export const useAddTrabalho = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: trabalhoService.addTrabalho,
    onSuccess: () => {
      // Invalida a query de trabalhos para forçar uma atualização
      queryClient.invalidateQueries({ queryKey: [TRABALHOS_QUERY_KEY] });
      // Invalida o resumo da semana para atualizar o total de horas
      queryClient.invalidateQueries({ queryKey: [RESUMO_SEMANA_QUERY_KEY] });
      // Invalida também o resumo do mês para atualizar os dados mensais
      queryClient.invalidateQueries({ queryKey: [RESUMO_MES_QUERY_KEY] });
    },
  });
};

/**
 * Hook para atualizar um trabalho existente
 */
export const useUpdateTrabalho = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...dados }) => trabalhoService.updateTrabalho(id, dados),
    onSuccess: (trabalhoAtualizado) => {
      // Atualiza o cache para refletir as mudanças imediatamente
      queryClient.setQueryData(
        [TRABALHOS_QUERY_KEY, trabalhoAtualizado.id], 
        trabalhoAtualizado
      );
      // Invalida a lista para refletir as mudanças
      queryClient.invalidateQueries({ queryKey: [TRABALHOS_QUERY_KEY] });
      // Invalida o resumo da semana para atualizar o total de horas
      queryClient.invalidateQueries({ queryKey: [RESUMO_SEMANA_QUERY_KEY] });
      // Invalida também o resumo do mês para atualizar os dados mensais
      queryClient.invalidateQueries({ queryKey: [RESUMO_MES_QUERY_KEY] });
    },
  });
};

/**
 * Hook para remover um trabalho
 */
export const useRemoveTrabalho = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: trabalhoService.removeTrabalho,
    onSuccess: () => {
      // Invalida a query de trabalhos para forçar uma atualização
      queryClient.invalidateQueries({ queryKey: [TRABALHOS_QUERY_KEY] });
      // Invalida o resumo da semana para atualizar o total de horas
      queryClient.invalidateQueries({ queryKey: [RESUMO_SEMANA_QUERY_KEY] });
      // Invalida também o resumo do mês para atualizar os dados mensais
      queryClient.invalidateQueries({ queryKey: [RESUMO_MES_QUERY_KEY] });
    },
  });
};
