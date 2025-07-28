import { useMemo } from 'react';

/**
 * Hook para fornecer opções para os componentes Select
 * @returns {Object} Objeto contendo diferentes conjuntos de opções
 */
const useSelectOptions = () => {

  // Opções para prioridades
  const prioridades = useMemo(() => [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' }
  ], []);

  // Opções para status
  const status = useMemo(() => [
    { value: 'pendente', label: 'Pendente' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' }
  ], []);

  // Opções para dias da semana
  const diasSemana = useMemo(() => [
    { value: 'domingo', label: 'Domingo' },
    { value: 'segunda', label: 'Segunda-feira' },
    { value: 'terca', label: 'Terça-feira' },
    { value: 'quarta', label: 'Quarta-feira' },
    { value: 'quinta', label: 'Quinta-feira' },
    { value: 'sexta', label: 'Sexta-feira' },
    { value: 'sabado', label: 'Sábado' }
  ], []);

  return {
    prioridades,
    status,
    diasSemana,
  };
};

export default useSelectOptions;
