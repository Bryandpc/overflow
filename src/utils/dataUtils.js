/**
 * Utilitários para manipulação e formatação de datas
 */

/**
 * Formata uma data no formato DD/MM
 * @param {string} dataString - String da data em formato ISO ou outro formato compatível com Date()
 * @returns {string} Data formatada como DD/MM
 */
export const formatarData = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    
    return `${dia}/${mes}`;
};

/**
 * Formata uma data no formato DD/MM/YYYY
 * @param {string} dataString - String da data em formato ISO ou outro formato compatível com Date()
 * @returns {string} Data formatada como DD/MM/YYYY
 */
export const formatarDataCompleta = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
};

/**
 * Formata data e hora no formato DD/MM/YYYY HH:MM
 * @param {string} dataString - String da data em formato ISO ou outro formato compatível com Date()
 * @returns {string} Data e hora formatadas
 */
export const formatarDataHora = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
};

/**
 * Verifica se uma data é hoje
 * @param {string} dataString - String da data em formato ISO
 * @returns {boolean} Verdadeiro se a data for hoje
 */
export const isHoje = (dataString) => {
    const data = new Date(dataString);
    const hoje = new Date();
    
    return data.getDate() === hoje.getDate() &&
           data.getMonth() === hoje.getMonth() &&
           data.getFullYear() === hoje.getFullYear();
};

/**
 * Retorna o nome do dia da semana abreviado
 * @param {string} dataString - String da data em formato ISO
 * @returns {string} Nome do dia da semana abreviado em português (Seg, Ter, etc)
 */
export const obterDiaSemana = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return diasSemana[data.getDay()];
};

/**
 * Formata a data com o dia da semana
 * @param {string} dataString - String da data em formato ISO
 * @returns {string} Data formatada como "DD/MM (Dia)"
 */
export const formatarDataComDiaSemana = (dataString) => {
    if (!dataString) return '';
    
    const dataFormatada = formatarData(dataString);
    const diaSemana = obterDiaSemana(dataString);
    
    return `${dataFormatada} (${diaSemana})`;
};
