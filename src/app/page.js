'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Cabecalho from '@/components/Cabecalho';
import GerenciadorTrabalhos from '@/components/GerenciadorTrabalhos';
import Dashboard from '@/components/Dashboard';
import ModalRelatorio from '@/components/ModalRelatorio';
import LoadingOverlay from '@/components/LoadingOverlay';
import { MdInsertChart } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import styles from '@/styles/Home.module.css';
import { useRelatorio } from '@/hooks/useRelatorio';
import { useTrabalhos } from '@/hooks/useTrabalhos';

// Import dinâmico do componente de download de PDF
const RelatorioDownloader = dynamic(() => import('@/components/RelatorioDownloader'), { 
  ssr: false 
});

export default function Home() {
  let abrirModal = null;
  const [tabAtiva, setTabAtiva] = useState('trabalhos');
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const { data: trabalhos } = useTrabalhos();
  const { 
    gerarRelatorio, 
    limparRelatorio, 
    relatorio, 
    periodo, 
    isLoading,
    isDownloading,
    showPDFDownloader,
    downloadAttempt,
    semTrabalhos,
    mensagemAviso,
    handlePDFDownloadComplete
  } = useRelatorio();

  useEffect(() => {
    if (showPDFDownloader && !semTrabalhos) {
      setModalRelatorioAberto(false);
    }
  }, [showPDFDownloader, semTrabalhos]);

  const handleSetAbrirModal = (fn) => {
    abrirModal = fn;
  };
  
  const handleAbrirModalRelatorio = () => {
    setModalRelatorioAberto(true);
  };
  
  const handleFecharModalRelatorio = () => {
    setModalRelatorioAberto(false);
    if (semTrabalhos) {
      limparRelatorio();
    }
  };
  
  const handleGerarRelatorio = async (periodo) => {
    await gerarRelatorio(periodo);
  };

  return (
    <div>
      <Cabecalho />
      
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.acoes}>
            <button 
              className={`${styles.botaoAcao} ${styles.botaoAdicionar}`}
              onClick={() => abrirModal && abrirModal()}
            >
              <IoAdd /> Adicionar Trabalho
            </button>
            {trabalhos && trabalhos.length > 0 && (
              <button 
                className={`${styles.botaoAcao} ${styles.botaoRelatorio}`}
                onClick={handleAbrirModalRelatorio}
              >
                <MdInsertChart /> Gerar Relatório
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${tabAtiva === 'trabalhos' ? styles.tabAtiva : ''}`}
              onClick={() => setTabAtiva('trabalhos')}
            >
              Lista de Trabalhos
            </button>
            <button 
              className={`${styles.tab} ${tabAtiva === 'dashboard' ? styles.tabAtiva : ''}`}
              onClick={() => setTabAtiva('dashboard')}
            >
              Dashboard
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {tabAtiva === 'trabalhos' && (
              <div className={styles.listaContainer}>
                <GerenciadorTrabalhos onAbrirModalAdicionar={handleSetAbrirModal} />
              </div>
            )}
            
            {tabAtiva === 'dashboard' && (
              <div className={styles.dashboardContainer}>
                <Dashboard />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <ModalRelatorio 
        isOpen={modalRelatorioAberto}
        onClose={handleFecharModalRelatorio}
        onGerarRelatorio={handleGerarRelatorio}
        mostrarAviso={semTrabalhos}
        mensagemAviso={mensagemAviso}
        isLoading={isLoading}
      />
      
      {showPDFDownloader && relatorio && periodo && (
        <RelatorioDownloader 
          key={`pdf-${downloadAttempt}`}
          trabalhos={relatorio}
          periodo={periodo}
          onComplete={handlePDFDownloadComplete}
        />
      )}
      
      <LoadingOverlay 
        visible={isDownloading} 
        message="Gerando e preparando o download do relatório..." 
      />
    </div>
  );
}
