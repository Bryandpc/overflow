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
        
        // Usar formatação local em vez de toISOString()
        const ano = inicioSemana.getFullYear();
        const mes = String(inicioSemana.getMonth() + 1).padStart(2, '0');
        const dia = String(inicioSemana.getDate()).padStart(2, '0');
        
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        
        const anoFim = fimSemana.getFullYear();
        const mesFim = String(fimSemana.getMonth() + 1).padStart(2, '0');
        const diaFim = String(fimSemana.getDate()).padStart(2, '0');

        const resultado = {
            inicio: `${ano}-${mes}-${dia}T00:00:00`,
            fim: `${anoFim}-${mesFim}-${diaFim}T23:59:59`
        };
        
        return resultado;
    }
    
    /**
     * Retorna o início e o fim do mês atual
     * @returns {Object} - Objeto com datas de início e fim do mês em formato ISO
     */
    static getInicioFimMes() {
        const agora = new Date();
        
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
        
        // Usar formatação local em vez de toISOString()
        const anoInicio = inicioMes.getFullYear();
        const mesInicio = String(inicioMes.getMonth() + 1).padStart(2, '0');
        const diaInicio = String(inicioMes.getDate()).padStart(2, '0');
        
        const anoFim = fimMes.getFullYear();
        const mesFim = String(fimMes.getMonth() + 1).padStart(2, '0');
        const diaFim = String(fimMes.getDate()).padStart(2, '0');
        
        return {
            inicio: `${anoInicio}-${mesInicio}-${diaInicio}T00:00:00`,
            fim: `${anoFim}-${mesFim}-${diaFim}T23:59:59`
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
        
        // Usar formatação local em vez de toISOString()
        const anoInicio = inicioSemanaAnterior.getFullYear();
        const mesInicio = String(inicioSemanaAnterior.getMonth() + 1).padStart(2, '0');
        const diaInicio = String(inicioSemanaAnterior.getDate()).padStart(2, '0');
        
        const anoFim = fimSemanaAnterior.getFullYear();
        const mesFim = String(fimSemanaAnterior.getMonth() + 1).padStart(2, '0');
        const diaFim = String(fimSemanaAnterior.getDate()).padStart(2, '0');
        
        const resultado = {
            inicio: `${anoInicio}-${mesInicio}-${diaInicio}T00:00:00`,
            fim: `${anoFim}-${mesFim}-${diaFim}T23:59:59`
        };
        
        return resultado;
    }
}

export default SemanaUtils;