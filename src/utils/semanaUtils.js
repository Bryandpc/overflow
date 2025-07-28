/**
 * Utilitários para manipulação de datas relacionadas a semanas e períodos
 */
class SemanaUtils {
    /**
     * Retorna o início e o fim da semana atual
     * @returns {Object} - Objeto com datas de início e fim da semana em formato ISO
     */
    static getInicioFimSemana() {
        const agora = new Date();
        const diaAtual = agora.getDay();
        const diasParaSegunda = diaAtual === 0 ? -6 : 1 - diaAtual;

        const inicioSemana = new Date(agora);
        inicioSemana.setDate(agora.getDate() + diasParaSegunda);
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        return {
            inicio: inicioSemana.toISOString(),
            fim: fimSemana.toISOString()
        };
    }
    
    /**
     * Retorna o início e o fim do mês atual
     * @returns {Object} - Objeto com datas de início e fim do mês em formato ISO
     */
    static getInicioFimMes() {
        const agora = new Date();
        
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        inicioMes.setHours(0, 0, 0, 0);
        
        const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
        fimMes.setHours(23, 59, 59, 999);
        
        return {
            inicio: inicioMes.toISOString(),
            fim: fimMes.toISOString()
        };
    }
    
    /**
     * Retorna o início e o fim da semana anterior
     * @returns {Object} - Objeto com datas de início e fim da semana anterior em formato ISO
     */
    static getInicioFimSemanaAnterior() {
        const { inicio: inicioSemanaAtual } = this.getInicioFimSemana();
        const inicioSemanaAtualDate = new Date(inicioSemanaAtual);
        
        const inicioSemanaAnterior = new Date(inicioSemanaAtualDate);
        inicioSemanaAnterior.setDate(inicioSemanaAtualDate.getDate() - 7);
        
        const fimSemanaAnterior = new Date(inicioSemanaAtualDate);
        fimSemanaAnterior.setDate(inicioSemanaAtualDate.getDate() - 1);
        fimSemanaAnterior.setHours(23, 59, 59, 999);
        
        return {
            inicio: inicioSemanaAnterior.toISOString(),
            fim: fimSemanaAnterior.toISOString()
        };
    }
}

export default SemanaUtils;