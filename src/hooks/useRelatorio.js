import { useState } from 'react';
import * as trabalhoService from '@/services/trabalhoService';

/**
 * Hook para gerenciar o processo de geração de relatórios
 * @returns {Object} Funções e estados para gerenciar relatórios
 */
export const useRelatorio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [relatorio, setRelatorio] = useState(null);
  const [periodo, setPeriodo] = useState(null);
  const [showPDFDownloader, setShowPDFDownloader] = useState(false);
  const [downloadAttempt, setDownloadAttempt] = useState(0);
  const [semTrabalhos, setSemTrabalhos] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState('');
  
  /**
   * Gera um relatório com base no período especificado
   * @param {Object} periodo Objeto contendo dataInicio e dataFim
   * @returns {Promise<Array>} Lista de trabalhos no período
   */
  const gerarRelatorio = async (periodo) => {
    setIsLoading(true);
    setError(null);
    setSemTrabalhos(false);
    setMensagemAviso('');
    
    try {
      const dataInicio = new Date(periodo.dataInicio + 'T00:00:00');
      dataInicio.setHours(0, 0, 0, 0);
      
      const dataFim = new Date(periodo.dataFim + 'T23:59:59');
      dataFim.setHours(23, 59, 59, 999);
      
      const trabalhos = await trabalhoService.getTrabalhosPorPeriodo(
        dataInicio.toISOString(), 
        dataFim.toISOString()
      );
      
      
      if (trabalhos.length === 0) {
        setSemTrabalhos(true);
        
        const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR');
        const dataFimFormatada = dataFim.toLocaleDateString('pt-BR');
        
        let mensagem = '';
        if (periodo.dataInicio === periodo.dataFim) {
          mensagem = `Nenhum trabalho encontrado para o dia ${dataInicioFormatada}.`;
        } else {
          mensagem = `Nenhum trabalho encontrado no período de ${dataInicioFormatada} a ${dataFimFormatada}.`;
        }
        
        setMensagemAviso(mensagem);
        
        const ontem = new Date(dataInicio);
        ontem.setDate(ontem.getDate() - 1);
        
        const amanha = new Date(dataFim);
        amanha.setDate(amanha.getDate() + 1);
        
        const trabalhosExtendidos = await trabalhoService.getTrabalhosPorPeriodo(
          ontem.toISOString(),
          amanha.toISOString()
        );
        
        if (trabalhosExtendidos.length > 0) {
          const datasMaisProximas = new Set();
          trabalhosExtendidos.forEach(trabalho => {
            if (trabalho.dataCriacao) {
              const data = new Date(trabalho.dataCriacao);
              datasMaisProximas.add(data.toLocaleDateString('pt-BR'));
            }
          });
          
          if (datasMaisProximas.size > 0) {
            const datasFormatadas = Array.from(datasMaisProximas).sort().join(', ');
            setMensagemAviso(prev => `${prev} Existem trabalhos nas seguintes datas próximas: ${datasFormatadas}.`);
          }
        }
        
        return [];
      }
      
      const trabalhosOrdenados = [...trabalhos].sort((a, b) => {
        return new Date(b.dataCriacao) - new Date(a.dataCriacao);
      });
      
      setRelatorio(trabalhosOrdenados);
      setPeriodo(periodo);
      
      if (trabalhosOrdenados.length > 0) {
        const periodoComNome = {
          ...periodo,
          nomeUsuario: periodo.nomeUsuario || null
        };
        
        setPeriodo(periodoComNome);
        
        setShowPDFDownloader(false);
        setDownloadAttempt(prev => prev + 1);
        setIsDownloading(true);
        setTimeout(() => {
          setShowPDFDownloader(true);
        }, 100);
      }
      
      return trabalhosOrdenados;
    } catch (err) {
      setError(err.message || 'Erro ao gerar relatório');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Limpa os dados do relatório atual
   */
  const limparRelatorio = () => {
    setRelatorio(null);
    setPeriodo(null);
  };
  
  /**
   * Callback para quando o download do PDF for concluído
   */
  const handlePDFDownloadComplete = (error) => {
    setTimeout(() => {
      setShowPDFDownloader(false);
      setIsDownloading(false);
      
      if (error) {
        setError(`Erro ao gerar PDF: ${error.message}`);
      }
    }, 100);
  };
  
  return {
    gerarRelatorio,
    limparRelatorio,
    isLoading,
    isDownloading,
    error,
    relatorio,
    periodo,
    showPDFDownloader,
    downloadAttempt,
    semTrabalhos,
    mensagemAviso,
    handlePDFDownloadComplete
  };
};

export default useRelatorio;
