/**
 * Formata um valor para o formato de horas (HH:MM)
 * @param {string} value - O valor a ser formatado
 * @param {boolean} enforceLimit - Se deve limitar horas (0-23) e minutos (0-59)
 * @returns {string} - O valor formatado
 */
export const formatarHoras = (value, enforceLimit = true) => {
  let numericValue = value.replace(/[^\d]/g, '');
  
  if (numericValue.length > 2) {
    numericValue = numericValue.substring(0, 2) + ':' + numericValue.substring(2);
  }
  
  if (numericValue.length > 5) {
    numericValue = numericValue.substring(0, 5);
  }
  
  if (enforceLimit && numericValue.length >= 2) {
    const hours = parseInt(numericValue.substring(0, 2) || '0');
    if (hours > 23) {
      numericValue = '23' + numericValue.substring(2);
    }
    
    if (numericValue.includes(':') && numericValue.length >= 4) {
      const minutes = parseInt(numericValue.substring(3, 5) || '0');
      if (minutes > 59) {
        numericValue = numericValue.substring(0, 3) + '59';
      }
    }
  }
  
  return numericValue;
};

/**
 * Valida se um valor está no formato de horas válido
 * @param {string} value - O valor a ser validado
 * @returns {boolean} - Se o valor é uma hora válida
 */
export const validarHoras = (value) => {
  if (!/^\d{1,2}:\d{2}$/.test(value)) return false;
  
  const [hours, minutes] = value.split(':');
  const hoursNum = parseInt(hours);
  const minutesNum = parseInt(minutes);
  
  return hoursNum >= 0 && hoursNum <= 23 && minutesNum >= 0 && minutesNum <= 59;
};

/**
 * Formata uma string para o formato de data (DD/MM/AAAA)
 * @param {string} value - O valor a ser formatado
 * @returns {string} - O valor formatado
 */
export const formatarData = (value) => {
  if (!value) return '';
  
  if (value instanceof Date) {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    const [year, month, day] = value.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }
  
  return value;
};

/**
 * Converte uma data formatada (DD/MM/YYYY) para o formato ISO (YYYY-MM-DD)
 * @param {string} value - O valor no formato DD/MM/YYYY
 * @returns {string} - O valor no formato YYYY-MM-DD
 */
export const converterParaFormatoISO = (value) => {
  if (!value) return '';
  
  const parts = value.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  
  return value;
};

/**
 * Converte horas em formato decimal para o formato HH:MM
 * @param {number} valorDecimal - Valor em horas decimais (ex: 1.5 = 1h30min)
 * @returns {string} - Horas no formato HH:MM
 */
export const converterDecimalParaHoraMinuto = (valorDecimal) => {
  if (valorDecimal === null || valorDecimal === undefined || isNaN(valorDecimal)) {
    return '00:00';
  }
  
  const valorPositivo = Math.abs(valorDecimal);
  
  const horas = Math.floor(valorPositivo);
  const minutos = Math.round((valorPositivo - horas) * 60);
  
  const horasFormatadas = horas.toString().padStart(2, '0');
  const minutosFormatados = minutos.toString().padStart(2, '0');
  
  return `${horasFormatadas}:${minutosFormatados}`;
};

/**
 * Função para formatar valores com base no tipo de formatação
 * @param {string} value - O valor a ser formatado
 * @param {string} formatType - O tipo de formatação ('time', 'currency', etc)
 * @returns {string} - O valor formatado
 */
export const formatarValor = (value, formatType) => {
  if (!value) return value;
  
  switch (formatType) {
    case 'time':
      return formatarHoras(value);
    case 'date':
      return formatarData(value);
    default:
      return value;
  }
};

/**
 * Enum para os tipos de formatação disponíveis para inputs
 * @readonly
 * @enum {string}
 */
const FormatTypes = {
    TIME: 'time',
    DATE: 'date',
    CURRENCY: 'currency',
    CPF: 'cpf',
    CNPJ: 'cnpj',
    PHONE: 'phone',
    CEP: 'cep',
    NUMBERS_ONLY: 'numbersOnly',
    LETTERS_ONLY: 'lettersOnly',
    PERCENTAGE: 'percentage',
};