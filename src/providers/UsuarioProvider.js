'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { buscarNomeUsuario, temNomeUsuario } from '@/utils/localStorageUtil';
import dynamic from 'next/dynamic';

const ModalNomeUsuario = dynamic(() => import('@/components/ModalNomeUsuario'), {
  ssr: false,
});

const UsuarioContext = createContext();

/**
 * Hook para acessar o contexto do usuário
 */
export const useUsuario = () => {
  return useContext(UsuarioContext);
};

/**
 * Provedor de contexto para gerenciar o estado do usuário
 */
export function UsuarioProvider({ children }) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verificarUsuario = () => {
        const temNome = temNomeUsuario();
        if (!temNome) {
          setMostrarModal(true);
        } else {
          const nome = buscarNomeUsuario();
          setNomeUsuario(nome);
        }
        setCarregando(false);
      };

      verificarUsuario();
    }
  }, []);

  const handleCloseModal = (nome) => {
    setMostrarModal(false);
    if (nome) {
      setNomeUsuario(nome);
    }
  };

  const value = {
    nomeUsuario,
    setNomeUsuario,
    carregando,
  };

  return (
    <UsuarioContext.Provider value={value}>
      {children}
      <ModalNomeUsuario onClose={handleCloseModal} />
    </UsuarioContext.Provider>
  );
}

export default UsuarioProvider;
