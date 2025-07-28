'use client';

import React, { useEffect, useState, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import RelatorioPDF from './RelatorioPDF';
import CalculoUtils from '@/utils/calculoUtils';
import { useUsuario } from '@/providers/UsuarioProvider';

/**
 * Componente que gera e faz o download automático do PDF
 * 
 * @param {Object} props
 * @param {Array} props.trabalhos - Lista de trabalhos para incluir no relatório
 * @param {Object} props.periodo - Objeto com dataInicio e dataFim
 * @param {Function} props.onComplete - Função chamada quando o download é concluído
 * @param {string} props.nomeUsuario - Nome do usuário para personalizar o relatório
 */
const RelatorioDownloader = ({ trabalhos, periodo, onComplete, nomeUsuario: nomeUsuarioProps }) => {
  const { nomeUsuario: nomeUsuarioContext } = useUsuario();
  const nomeUsuario = nomeUsuarioProps || nomeUsuarioContext;
  
  const [status, setStatus] = useState('idle');
  const mounted = useRef(true);
  const processAttempted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (processAttempted.current) return;
    
    const gerarEBaixarPDF = async () => {
      if (!mounted.current) return;
      if (status !== 'idle') return;
      
      try {
        processAttempted.current = true;
        setStatus('loading');
        
        const estatisticas = trabalhos.reduce((acc, trabalho) => {
          if (trabalho.prioridade) {
            acc[trabalho.prioridade]++;
          }
          acc.total++;
          return acc;
        }, { baixa: 0, media: 0, alta: 0, urgente: 0, total: 0 });
        
        const horasTrabalhadas = CalculoUtils.calcularHorasTrabalhadas(trabalhos);
        
        const nomeArquivo = `relatorio-${periodo.dataInicio.split('-').join('')}-${periodo.dataFim.split('-').join('')}.pdf`;
        
        const document = <RelatorioPDF 
          trabalhos={trabalhos}
          periodo={periodo}
          estatisticas={estatisticas}
          horasTrabalhadas={horasTrabalhadas}
          nomeUsuario={nomeUsuario}
        />;
        
        const blob = await pdf(document).toBlob();
        
        if (!mounted.current) return;
        
        saveAs(blob, nomeArquivo);
        setStatus('success');
        
        if (onComplete && mounted.current) {
          setTimeout(() => {
            if (mounted.current) {
              onComplete();
            }
          }, 1500);
        }
      } catch (error) {
        if (mounted.current) {
          setStatus('error');
          if (onComplete) onComplete(error);
        }
      }
    };

    if (trabalhos && trabalhos.length > 0 && periodo) {
      gerarEBaixarPDF();
    } else if (!trabalhos || trabalhos.length === 0) {
      if (mounted.current && onComplete) {
        setStatus('error');
        onComplete(new Error('Nenhum trabalho disponível para gerar relatório'));
      }
    }
  }, [trabalhos, periodo, onComplete, status]);

  return null;
};

export default RelatorioDownloader;
