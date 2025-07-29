/**
 * Utilitários para cálculos relacionados a horas e períodos de trabalho
 */
class CalculoUtils {
    /**
     * Calcula o total de horas trabalhadas a partir de uma lista de trabalhos
     * @param {Array} trabalhos - Lista de trabalhos com horário de início e fim
     * @returns {Object} - Objeto contendo horas e minutos totais, e uma string formatada
     */
    static calcularHorasTrabalhadas(trabalhos) {
        if (!trabalhos || !trabalhos.length) {
            return {
                horas: 0,
                minutos: 0,
                totalFormatado: '00:00'
            };
        }

        let totalMinutos = 0;

        trabalhos.forEach(trabalho => {
            if (trabalho.horaInicio && trabalho.horaFim) {
                const [horaInicio, minutoInicio] = trabalho.horaInicio.split(':').map(Number);
                const [horaFim, minutoFim] = trabalho.horaFim.split(':').map(Number);
                
                const minutosInicio = horaInicio * 60 + minutoInicio;
                let minutosFim = horaFim * 60 + minutoFim;
                
                if (minutosFim < minutosInicio) {
                    minutosFim += 24 * 60; 
                }
                
                const diferencaMinutos = minutosFim - minutosInicio;
                
                if (diferencaMinutos > 0) {
                    totalMinutos += diferencaMinutos;
                }
            }
        });

        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        
        const horasFormatadas = horas.toString().padStart(2, '0');
        const minutosFormatados = minutos.toString().padStart(2, '0');
        const totalFormatado = `${horasFormatadas}:${minutosFormatados}`;

        return {
            horas,
            minutos,
            totalMinutos,
            totalFormatado
        };
    }
    
    /**
     * Calcula estatísticas de média diária com base no total de minutos
     * @param {Object} horasTrabalhadas - Resultado do cálculo de horas trabalhadas
     * @param {number} diasUteis - Número de dias úteis para calcular média
     * @returns {Object} - Objeto com a média formatada
     */
    static calcularMediaDiaria(horasTrabalhadas, diasUteis = 5) {
        if (!horasTrabalhadas || !horasTrabalhadas.totalMinutos) {
            return { mediaHorasDiarias: '00:00' };
        }
        
        const mediaMinutos = horasTrabalhadas.totalMinutos / diasUteis;
        const mediaHoras = Math.floor(mediaMinutos / 60);
        const mediaMinutosRestantes = Math.floor(mediaMinutos % 60);
        
        return {
            mediaHorasDiarias: `${String(mediaHoras).padStart(2, '0')}:${String(mediaMinutosRestantes).padStart(2, '0')}`
        };
    }
    
    /**
     * Calcula o total de minutos trabalhados a partir de uma lista de trabalhos
     * @param {Array} trabalhos - Lista de trabalhos do período
     * @returns {number} - Total de minutos trabalhados
     */
    static calcularTotalMinutosTrabalhados(trabalhos) {
        if (!trabalhos || !trabalhos.length) {
            return 0;
        }
        
        let totalMinutos = 0;
        
        trabalhos.forEach(trabalho => {
            if (trabalho.horaInicio && trabalho.horaFim) {
                const [horaInicio, minutoInicio] = trabalho.horaInicio.split(':').map(Number);
                const [horaFim, minutoFim] = trabalho.horaFim.split(':').map(Number);
                
                const minutosInicio = horaInicio * 60 + minutoInicio;
                let minutosFim = horaFim * 60 + minutoFim;
                
                // Se a hora de fim é menor que a de início, passou da meia-noite
                if (minutosFim < minutosInicio) {
                    minutosFim += 24 * 60; // Adiciona 24 horas em minutos
                }
                
                const diferencaMinutos = minutosFim - minutosInicio;
                
                if (diferencaMinutos > 0) {
                    totalMinutos += diferencaMinutos;
                }
            }
        });
        
        return totalMinutos;
    }
    
    /**
     * Calcula o total de horas trabalhadas em formato decimal a partir de uma lista de trabalhos
     * @param {Array} trabalhos - Lista de trabalhos do período
     * @returns {number} - Total de horas trabalhadas (formato decimal)
     */
    static calcularTotalHorasTrabalhadas(trabalhos) {
        const totalMinutos = this.calcularTotalMinutosTrabalhados(trabalhos);
        return parseFloat((totalMinutos / 60).toFixed(2));
    }
    
    /**
     * Compara as horas trabalhadas entre dois períodos e retorna a variação percentual
     * @param {Array} trabalhosPeriodoAtual - Lista de trabalhos do período atual
     * @param {Array} trabalhosPeriodoAnterior - Lista de trabalhos do período anterior para comparação
     * @returns {Object} - Dados da comparação entre períodos
     */
    static compararPeriodos(trabalhosPeriodoAtual, trabalhosPeriodoAnterior) {
        const totalMinutosAtual = this.calcularTotalMinutosTrabalhados(trabalhosPeriodoAtual);
        const totalMinutosAnterior = this.calcularTotalMinutosTrabalhados(trabalhosPeriodoAnterior);
        
        const totalHorasAtual = parseFloat((totalMinutosAtual / 60).toFixed(2));
        const totalHorasAnterior = parseFloat((totalMinutosAnterior / 60).toFixed(2));
        
        const totalHorasFormatadoAtual = this.formatarHorasMinutos(totalMinutosAtual);
        const totalHorasFormatadoAnterior = this.formatarHorasMinutos(totalMinutosAnterior);
        
        let variacao = 0;
        let percentual = 0;
        let tendencia = 'estável';
        
        if (totalHorasAnterior > 0) {
            variacao = totalHorasAtual - totalHorasAnterior;
            percentual = (variacao / totalHorasAnterior) * 100;
            
            if (percentual > 0) {
                tendencia = 'aumento';
            } else if (percentual < 0) {
                tendencia = 'diminuição';
            }
        } else if (totalHorasAtual > 0) {
            // Se o período anterior não tinha horas, mas o atual tem
            variacao = totalHorasAtual;
            percentual = 100;
            tendencia = 'aumento';
        }
        
        return {
            totalHorasAtual,
            totalHorasAnterior,
            totalHorasFormatadoAtual,
            totalHorasFormatadoAnterior,
            variacao,
            percentual: Math.abs(parseFloat(percentual.toFixed(1))),
            tendencia,
            mensagem: this.gerarMensagemComparativa(percentual, tendencia)
        };
    }
    
    /**
     * Gera uma mensagem descritiva para a comparação entre períodos
     * @param {number} percentual - Valor percentual da variação
     * @param {string} tendencia - Tendência da variação (aumento, diminuição ou estável)
     * @returns {string} - Mensagem formatada
     */
    static gerarMensagemComparativa(percentual, tendencia) {
        if (tendencia === 'estável') {
            return 'Mesmo tempo do período anterior';
        }
        
        const percentualFormatado = Math.abs(parseFloat(percentual.toFixed(1)));
        
        if (tendencia === 'aumento') {
            return `${percentualFormatado}% a mais que no período anterior`;
        } else {
            return `${percentualFormatado}% a menos que no período anterior`;
        }
    }
    
    /**
     * Formata minutos para o formato de horas e minutos (HH:MM)
     * @param {number} minutos - Total de minutos
     * @returns {string} - Tempo formatado (HH:MM)
     */
    static formatarHorasMinutos(minutos) {
        if (minutos === null || minutos === undefined || isNaN(minutos)) {
            return '00:00';
        }
        
        // Garantir que minutos seja um número positivo
        const minutosPositivos = Math.abs(Math.round(minutos));
        const horas = Math.floor(minutosPositivos / 60);
        const minutosRestantes = Math.floor(minutosPositivos % 60);
        
        return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
    }
}

export default CalculoUtils;
