'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/ModalRelatorio.module.css';
import FormInput from './FormInput';
import BotaoFlutuante from './BotaoFlutuante';
import Modal from './Modal';
import { IoCheckmarkDone } from "react-icons/io5";
import { buscarNomeUsuario, salvarNomeUsuario, temNomeUsuario } from '@/utils/localStorageUtil';

/**
 * Modal para solicitar o nome do usuário na primeira vez que acessar o aplicativo
 * @param {Object} props 
 * @param {Function} props.onClose - Função chamada quando o modal é fechado
 */
const ModalNomeUsuario = ({ onClose }) => {
  const [mostrarModal, setMostrarModal] = useState(true);
  
  const { 
    handleSubmit, 
    control,  
    formState: { errors },
    setError
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nome: ''
    }
  });
  
  useEffect(() => {
    const nomeArmazenado = buscarNomeUsuario();
    if (!nomeArmazenado) {
      setMostrarModal(true);
    } else {
      setMostrarModal(false);
    }
  }, []);

  const onSubmit = (data) => {
    if (!data.nome.trim()) {
      setError('nome', { 
        type: 'manual', 
        message: 'Por favor, informe seu nome' 
      });
      return;
    }
    
    salvarNomeUsuario(data.nome.trim());
    setMostrarModal(false);
    if (onClose) onClose(data.nome.trim());
  };

  return (
    <Modal
      isOpen={mostrarModal}
      onClose={() => {
        if (!temNomeUsuario()) {
          setError('geral', { 
            type: 'manual', 
            message: 'Por favor, informe seu nome para continuar' 
          });
        }
      }}
      titulo="Bem-vindo ao Overflow!"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.content}>
          <p className={styles.instrucao}>
            Para personalizar sua experiência, informe seu nome abaixo:
          </p>
          
          {errors.geral && <p className={styles.erro}>{errors.geral.message}</p>}
          
          <FormInput 
            name="nome"
            control={control}
            rules={{ required: "Nome é obrigatório" }}
            label="Seu Nome"
            type="text"
            error={errors.nome?.message}
            required
            placeholder="Digite seu nome"
          />
        </div>
        
        <div className={styles.acoes}>
          <BotaoFlutuante 
            texto="Confirmar"
            type={BotaoFlutuante.Tipos.SUBMIT}
            icone={<IoCheckmarkDone />}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ModalNomeUsuario;
