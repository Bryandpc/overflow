/**
 * const FERIADOS_NACIONAIS = [
  '01-01',
  '04-21',
  '05-01',
  '09-07',
  '10-12',
  '11-02',
  '11-15',
  '12-25'
];s para cálculos de percentuais de horas extras
 */

/**
 * Lista de feriados nacionais para o ano atual
 * Formato: MM-DD (mês-dia)
 */
const FERIADOS = [
  '01-01',
  '04-21',
  '05-01',
  '09-07',
  '10-12',
  '11-02',
  '11-15',
  '12-25'
];

/**
 * Verifica se uma data é um feriado nacional
 * @param {Date|string} data - Data para verificar
 * @returns {boolean} Verdadeiro se for feriado
 */
export const isFeriado = (data) => {
  const dataObj = data instanceof Date ? data : new Date(data);
  
  const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
  const dia = dataObj.getDate().toString().padStart(2, '0');
  const dataFormatada = `${mes}-${dia}`;
  
  return FERIADOS.includes(dataFormatada);
};

/**
 * Retorna o percentual de hora extra com base na data
 * Segunda a sábado: 55%
 * Domingos e feriados: 100%
 * 
 * @param {Date|string} data - Data para calcular o percentual
 * @returns {string} Percentual formatado
 */
export const calcularPercentualHoraExtra = (data) => {
  if (!data) return '0%';
  
  const dataObj = data instanceof Date ? data : new Date(data);
  const diaSemana = dataObj.getDay();
  
  if (diaSemana === 0 || isFeriado(dataObj)) {
    return '100%';
  } else {
    return '55%';
  }
};

/**
 * Retorna as informações completas sobre o percentual de hora extra
 * @param {Date|string} data - Data para calcular
 * @returns {Object} Objeto com informações sobre o percentual
 */
export const getInfoHoraExtra = (data) => {
  if (!data) return { 
    percentual: '0%', 
    tipo: 'indefinido',
    isFeriado: false,
    isDomingo: false
  };
  
  const dataObj = data instanceof Date ? data : new Date(data);
  const diaSemana = dataObj.getDay();
  const ehFeriado = isFeriado(dataObj);
  const ehDomingo = diaSemana === 0;
  
  let tipo = 'normal';
  if (ehFeriado) tipo = 'feriado';
  else if (ehDomingo) tipo = 'domingo';
  
  return {
    percentual: calcularPercentualHoraExtra(dataObj),
    tipo,
    isFeriado: ehFeriado,
    isDomingo: ehDomingo
  };
};
