'use client';

import React from 'react';
import styles from '@/styles/LoadingOverlay.module.css';

/**
 * Componente de overlay de carregamento
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.visible - Se o overlay está visível
 * @param {string} props.message - Mensagem a ser exibida
 */
const LoadingOverlay = ({ visible, message = "Gerando relatório..." }) => {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
