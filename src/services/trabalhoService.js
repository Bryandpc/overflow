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
  
  const novoTrabalho = {
    ...trabalho,
    id: generateId(),
    dataCriacao: new Date().toISOString()
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
  
  trabalhos[index] = { 
    ...trabalhos[index], 
    ...dadosAtualizados,
    dataAtualizacao: new Date().toISOString() 
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
  
  const dataInicioObj = new Date(dataInicio);
  const dataFimObj = new Date(dataFim);
  
  const trabalhosFiltrados = trabalhos.filter(trabalho => {
    const dataTrabalho = trabalho.dataCriacao;
    
    if (!dataTrabalho) {
      return false;
    }
    
    const dataTrabalhoObj = new Date(dataTrabalho);
    const dataTrabalhoApenasData = new Date(dataTrabalhoObj);
    dataTrabalhoApenasData.setHours(0, 0, 0, 0);
    
    const dataInicioApenasData = new Date(dataInicioObj);
    dataInicioApenasData.setHours(0, 0, 0, 0);
    
    const dataFimApenasData = new Date(dataFimObj);
    dataFimApenasData.setHours(23, 59, 59, 999);
    
    const dentroDoIntervalo = 
      dataTrabalhoApenasData.getTime() >= dataInicioApenasData.getTime() && 
      dataTrabalhoApenasData.getTime() <= dataFimApenasData.getTime();
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const ehHoje = dataTrabalhoApenasData.getTime() >= hoje.getTime() && dataTrabalhoApenasData.getTime() < amanha.getTime();
    
    return dentroDoIntervalo;
  });
  
  if (trabalhosFiltrados.length === 0 || trabalhosFiltrados.length < trabalhos.length / 3) {
    const datasDisponiveisSet = new Set();
    trabalhos.forEach(trabalho => {
      if (trabalho.dataCriacao) {
        const data = new Date(trabalho.dataCriacao);
        datasDisponiveisSet.add(data.toLocaleDateString('pt-BR'));
      }
    });
  }
  
  return trabalhosFiltrados.sort((a, b) => {
    const dataA = new Date(a.dataCriacao);
    const dataB = new Date(b.dataCriacao);
    return dataB - dataA;
  });
};
