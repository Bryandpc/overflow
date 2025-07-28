import CalculoUtils from './calculoUtils';

/**
 * Utilitários para processamento de dados e cálculos do Dashboard
 */
class DashboardUtils {
  /**
   * Processa os dados para o gráfico de distribuição por dia da semana
   * @param {Array} trabalhos - Lista de trabalhos (pode ser semanal ou mensal)
   * @returns {Array} - Dados processados para o gráfico de barras
   */
  static processarDadosGraficoDias(trabalhos) {
    if (!trabalhos || !trabalhos.length) {
      return [];
    }

    const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const dadosPorDia = diasDaSemana.map(dia => ({ dia, horasEmMinutos: 0 }));
    
    trabalhos.forEach(trabalho => {
      if (trabalho.dataCriacao) {
        const data = new Date(trabalho.dataCriacao);
        const diaSemana = data.getDay(); 
        
        const diaSemanaIndex = diaSemana === 0 ? 6 : diaSemana - 1; 
        
        if (trabalho.horaInicio && trabalho.horaFim) {
          const [horaInicio, minutoInicio] = trabalho.horaInicio.split(':').map(Number);
          const [horaFim, minutoFim] = trabalho.horaFim.split(':').map(Number);
          
          const minutosInicio = horaInicio * 60 + minutoInicio;
          const minutosFim = horaFim * 60 + minutoFim;
          const diferencaMinutos = minutosFim - minutosInicio;
          
          if (diferencaMinutos > 0) {
            if (diaSemanaIndex >= 0 && diaSemanaIndex < dadosPorDia.length) {
              dadosPorDia[diaSemanaIndex].horasEmMinutos += diferencaMinutos;
            } else {
              console.error(`Índice inválido: ${diaSemanaIndex} para dia da semana: ${diaSemana}`);
            }
          }
        }
      }
    });
    
    const dadosProcessados = dadosPorDia.map(item => {
      const horasDecimais = parseFloat((item.horasEmMinutos / 60).toFixed(2));
      return {
        dia: item.dia,
        horas: horasDecimais,
        horasFormatadas: this.formatarHorasMinutos(item.horasEmMinutos)
      };
    });
    
    return dadosProcessados;
  }

  /**
   * Processa os dados para o gráfico de distribuição por prioridade
   * @param {Array} trabalhos - Lista de trabalhos (pode ser semanal ou mensal)
   * @returns {Array} - Dados processados para o gráfico de pizza
   */
  static processarDadosGraficoPrioridade(trabalhos) {
    if (!trabalhos || !trabalhos.length) {
      return [];
    }

    const dadosPorPrioridade = {
      baixa: 0,
      media: 0,
      alta: 0,
      urgente: 0
    };
    
    trabalhos.forEach(trabalho => {
      if (trabalho.prioridade && trabalho.horaInicio && trabalho.horaFim) {
        const [horaInicio, minutoInicio] = trabalho.horaInicio.split(':').map(Number);
        const [horaFim, minutoFim] = trabalho.horaFim.split(':').map(Number);
        
        const minutosInicio = horaInicio * 60 + minutoInicio;
        const minutosFim = horaFim * 60 + minutoFim;
        const diferencaMinutos = minutosFim - minutosInicio;
        
        if (diferencaMinutos > 0) {
          dadosPorPrioridade[trabalho.prioridade] += diferencaMinutos;
        }
      }
    });
    
    return [
      { 
        nome: 'Baixa', 
        valor: parseFloat((dadosPorPrioridade.baixa / 60).toFixed(2)), 
        valorFormatado: this.formatarHorasMinutos(dadosPorPrioridade.baixa),
        cor: '#2f855a' 
      },
      { 
        nome: 'Média', 
        valor: parseFloat((dadosPorPrioridade.media / 60).toFixed(2)), 
        valorFormatado: this.formatarHorasMinutos(dadosPorPrioridade.media),
        cor: '#d97706' 
      },
      { 
        nome: 'Alta', 
        valor: parseFloat((dadosPorPrioridade.alta / 60).toFixed(2)), 
        valorFormatado: this.formatarHorasMinutos(dadosPorPrioridade.alta),
        cor: '#F56565' 
      },
      { 
        nome: 'Urgente', 
        valor: parseFloat((dadosPorPrioridade.urgente / 60).toFixed(2)), 
        valorFormatado: this.formatarHorasMinutos(dadosPorPrioridade.urgente),
        cor: '#6B46C1' 
      }
    ].filter(item => item.valor > 0);
  }

  /**
   * Formata minutos para o formato de horas e minutos (HH:MM)
   * @param {number} minutos - Total de minutos
   * @returns {string} - Tempo formatado (HH:MM)
   */
  static formatarHorasMinutos(minutos) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = Math.floor(minutos % 60);
    
    return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
  }
  
  /**
   * Usa o CalculoUtils para calcular a média diária
   * @param {Object} horasTrabalhadas - Resultado do cálculo de horas trabalhadas
   * @param {number} diasUteis - Número de dias úteis para calcular média
   * @returns {Object} - Objeto com a média formatada
   */
  static calcularMediaDiaria(horasTrabalhadas, diasUteis = 5) {
    return CalculoUtils.calcularMediaDiaria(horasTrabalhadas, diasUteis);
  }
  
  /**
   * Usa o CalculoUtils para comparar períodos
   * @param {Array} trabalhosPeriodoAtual - Lista de trabalhos do período atual
   * @param {Array} trabalhosPeriodoAnterior - Lista de trabalhos do período anterior para comparação
   * @returns {Object} - Dados da comparação entre períodos
   */
  static compararPeriodos(trabalhosPeriodoAtual, trabalhosPeriodoAnterior) {
    return CalculoUtils.compararPeriodos(trabalhosPeriodoAtual, trabalhosPeriodoAnterior);
  }
}

export default DashboardUtils;
