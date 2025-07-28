'use client';

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RelatorioPDF from './RelatorioPDF';
import styles from '@/styles/BotaoDownloadPDF.module.css';
import { useUsuario } from '@/providers/UsuarioProvider';

/**
 * Componente que renderiza um botão para baixar o relatório em PDF
 * 
 * @param {Object} props
 * @param {Array} props.trabalhos - Lista de trabalhos para incluir no relatório
 * @param {Object} props.periodo - Objeto com dataInicio e dataFim
 * @param {Object} props.estatisticas - Estatísticas dos trabalhos por prioridade
 * @param {Object} props.horasTrabalhadas - Informação sobre horas trabalhadas
 */
const BotaoDownloadPDF = ({ trabalhos, periodo, estatisticas, horasTrabalhadas }) => {
  const { nomeUsuario } = useUsuario();
  
  const nomeArquivo = `relatorio-${periodo.dataInicio.split('-').join('')}-${periodo.dataFim.split('-').join('')}.pdf`;

  return (
    <div className={styles.containerBotao}>
      <PDFDownloadLink
        document={
          <RelatorioPDF 
            trabalhos={trabalhos}
            periodo={periodo}
            estatisticas={estatisticas}
            horasTrabalhadas={horasTrabalhadas}
            nomeUsuario={nomeUsuario}
          />
        }
        fileName={nomeArquivo}
        className={styles.botaoDownload}
      >
        {({ blob, url, loading, error }) => 
          loading ? 'Gerando PDF...' : 'Baixar PDF'
        }
      </PDFDownloadLink>
    </div>
  );
};

export default BotaoDownloadPDF;
