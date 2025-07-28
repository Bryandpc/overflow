'use client';

import { useState, useEffect, useCallback } from 'react';
import ListaTrabalhos from './ListaTrabalhos';
import FormularioTrabalho from './FormularioTrabalho';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';
import styles from '@/styles/GerenciadorTrabalhos.module.css';

const GerenciadorTrabalhos = ({ onAbrirModalAdicionar }) => {
  const { isOpen, abrirModal, fecharModal } = useModal();
  const [trabalhoEmEdicao, setTrabalhoEmEdicao] = useState(null);
  
  const handleAbrirModal = useCallback(() => {
    setTrabalhoEmEdicao(null);
    abrirModal();
  }, [abrirModal]);
  
  const handleFecharModal = () => {
    fecharModal();
    setTrabalhoEmEdicao(null);
  };
  
  useEffect(() => {
    if (onAbrirModalAdicionar) {
      onAbrirModalAdicionar(handleAbrirModal);
    }
  }, [onAbrirModalAdicionar, handleAbrirModal]);
  
  const editarTrabalho = (trabalho) => {
    setTrabalhoEmEdicao(trabalho);
    abrirModal();
  };

  return (
    <div className={styles.gerenciador}>
      <div className={styles.listaContainer}>
        <ListaTrabalhos onEditarTrabalho={editarTrabalho} />
      </div>
      
      <Modal 
        isOpen={isOpen}
        onClose={handleFecharModal}
        titulo={trabalhoEmEdicao ? "Editar Trabalho" : "Novo Trabalho"}
      >
        <FormularioTrabalho
          onSubmit={handleFecharModal}
          onCancel={handleFecharModal}
          trabalhoInicial={trabalhoEmEdicao}
        />
      </Modal>
    </div>
  );
};

export default GerenciadorTrabalhos;
