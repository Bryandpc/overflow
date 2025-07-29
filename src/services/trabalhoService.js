import { 
  buscarDoStorage, 
  salvarNoStorage,
  localStorageDisponivel
} from '@/utils/localStorageUtil';

const CHAVE_TRABALHOS = 'overflow-trabalhos';

/**
 * Gera um ID único para um novo trabalho
 * @returns {string} ID único
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Retorna todos os trabalhos armazenados, ordenados do mais recente para o mais antigo
 * @returns {Array} Lista de trabalhos
 */
export const getTrabalhos = async () => {
  if (!localStorageDisponivel()) {
    console.error('LocalStorage não está disponível');
    return [];
  }
  
  const trabalhos = buscarDoStorage(CHAVE_TRABALHOS, []);
  
  return trabalhos.sort((a, b) => {
    const dataA = new Date(a.dataCriacao);
    const dataB = new Date(b.dataCriacao);
    return dataB - dataA;
  });
};

/**
 * Retorna um trabalho específico pelo ID
 * @param {string} id ID do trabalho
 * @returns {Object|null} Trabalho encontrado ou null
 */
export const getTrabalhoById = async (id) => {
  const trabalhos = await getTrabalhos();
  return trabalhos.find(trabalho => trabalho.id === id) || null;
};

/**
 * Adiciona um novo trabalho
 * @param {Object} trabalho Dados do trabalho
 * @returns {Object} Trabalho adicionado com ID
 */
export const addTrabalho = async (trabalho) => {
  const trabalhos = await getTrabalhos();
  
  // Criar data local em vez de UTC
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');
  const segundo = String(agora.getSeconds()).padStart(2, '0');
  
  const dataLocal = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
  
  const novoTrabalho = {
    ...trabalho,
    id: generateId(),
    dataCriacao: dataLocal
  };
  
  const trabalhosAtualizados = [...trabalhos, novoTrabalho];
  const sucesso = salvarNoStorage(CHAVE_TRABALHOS, trabalhosAtualizados);
  
  if (!sucesso) {
    throw new Error('Falha ao salvar o trabalho no localStorage');
  }
  
  return novoTrabalho;
};

/**
 * Atualiza um trabalho existente
 * @param {string} id ID do trabalho
 * @param {Object} dadosAtualizados Novos dados
 * @returns {Object|null} Trabalho atualizado ou null se não encontrado
 */
export const updateTrabalho = async (id, dadosAtualizados) => {
  const trabalhos = await getTrabalhos();
  const index = trabalhos.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  // Criar data local em vez de UTC para a atualização
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');
  const segundo = String(agora.getSeconds()).padStart(2, '0');
  
  const dataLocal = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
  
  trabalhos[index] = { 
    ...trabalhos[index], 
    ...dadosAtualizados,
    dataAtualizacao: dataLocal 
  };
  
  const sucesso = salvarNoStorage(CHAVE_TRABALHOS, trabalhos);
  
  if (!sucesso) {
    throw new Error('Falha ao atualizar o trabalho no localStorage');
  }
  
  return trabalhos[index];
};

/**
 * Remove um trabalho pelo ID
 * @param {string} id ID do trabalho
 * @returns {boolean} True se removido com sucesso
 */
export const removeTrabalho = async (id) => {
  const trabalhos = await getTrabalhos();
  const trabalhosAtualizados = trabalhos.filter(t => t.id !== id);
  
  if (trabalhosAtualizados.length === trabalhos.length) {
    return false;
  }
  
  return salvarNoStorage(CHAVE_TRABALHOS, trabalhosAtualizados);
};

/**
 * Busca trabalhos por período (início e fim)
 * @param {string} dataInicio Data de início no formato ISO
 * @param {string} dataFim Data de fim no formato ISO
 * @returns {Array} Trabalhos dentro do período especificado
 */
export const getTrabalhosPorPeriodo = async (dataInicio, dataFim) => {
  const trabalhos = await getTrabalhos();
  
  const trabalhosFiltrados = trabalhos.filter(trabalho => {
    const dataTrabalho = trabalho.dataCriacao;
    
    if (!dataTrabalho) {
      return false;
    }
    
    // Extrair apenas a parte da data (YYYY-MM-DD) sem considerar o horário
    const dataTrabalhoString = dataTrabalho.split('T')[0];
    const dataInicioString = dataInicio.split('T')[0];
    const dataFimString = dataFim.split('T')[0];
    
    // Comparar apenas as strings de data
    return dataTrabalhoString >= dataInicioString && dataTrabalhoString <= dataFimString;
  });
  
  return trabalhosFiltrados.sort((a, b) => {
    const dataA = new Date(a.dataCriacao);
    const dataB = new Date(b.dataCriacao);
    return dataB - dataA;
  });
};
