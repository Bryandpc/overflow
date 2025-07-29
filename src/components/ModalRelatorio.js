'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import FormInput from './FormInput';
import BotaoFlutuante from './BotaoFlutuante';
import { IoClose } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import styles from '@/styles/ModalRelatorio.module.css';
import { useUsuario } from '@/providers/UsuarioProvider';

/**
 * Modal para seleção de período e geração de relatório
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Controla se o modal está visível
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Function} props.onGerarRelatorio - Função que recebe as datas e gera o relatório
 * @param {boolean} props.mostrarAviso - Indica se deve mostrar um aviso de nenhum trabalho encontrado
 * @param {string} props.mensagemAviso - Mensagem de aviso personalizada
 * @param {boolean} props.isLoading - Indica se está processando a geração do relatório
 */
const ModalRelatorio = ({ 
  isOpen, 
  onClose, 
  onGerarRelatorio,
  mostrarAviso = false,
  mensagemAviso = "Nenhum trabalho encontrado para o período selecionado.",
  isLoading = false
}) => {
  const { nomeUsuario } = useUsuario();
  
  const { 
    handleSubmit, 
    control, 
    reset, 
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      dataInicio: '',
      dataFim: ''
    }
  });
  
  useEffect(() => {
    if (isOpen) {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const dia = String(hoje.getDate()).padStart(2, '0');
      const anoMesDia = `${ano}-${mes}-${dia}`;
      
      reset({
        dataInicio: anoMesDia,
        dataFim: anoMesDia
      });
      
      clearErrors();
    }
  }, [isOpen, reset, clearErrors]);

  const validarDatas = (data) => {
    const inicio = new Date(data.dataInicio);
    const fim = new Date(data.dataFim);
    
    if (fim < inicio) {
      setError('geral', { 
        type: 'manual', 
        message: 'A data final não pode ser anterior à data inicial' 
      });
      return false;
    }
    
    clearErrors('geral');
    return true;
  };

  const onSubmit = (data) => {
    if (!validarDatas(data)) {
      return;
    }
    
    onGerarRelatorio({ ...data, nomeUsuario });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo="Gerar Relatório"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.content}>
          <p className={styles.instrucao}>
            Selecione o período para gerar o relatório de trabalhos realizados.
          </p>
          
          {errors.geral && <p className={styles.erro}>{errors.geral.message}</p>}
          
          {mostrarAviso && (
            <div className={styles.avisoContainer}>
              <p className={styles.avisoMensagem}>
                <span className={styles.avisoIcone}>⚠️</span> 
                {mensagemAviso}
              </p>
            </div>
          )}
          
          <FormInput 
            name="dataInicio"
            control={control}
            rules={{ required: "Data inicial é obrigatória" }}
            label="Data Inicial"
            type="date"
            error={errors.dataInicio?.message}
            required
            customClass={styles.inputData}
          />
          
          <FormInput 
            name="dataFim"
            control={control}
            rules={{ required: "Data final é obrigatória" }}
            label="Data Final"
            type="date"
            error={errors.dataFim?.message}
            required
            customClass={styles.inputData}
          />
        </div>
        
        <div className={styles.acoes}>
          <BotaoFlutuante 
            texto="Cancelar"
            aoClicar={onClose}
            icone={<IoClose />}
            isCancelar
            disabled={isLoading}
          />
          <BotaoFlutuante 
            texto={isLoading ? "Gerando..." : "Gerar Relatório"}
            type={BotaoFlutuante.Tipos.SUBMIT}
            icone={isLoading ? <span className={styles.rotatingIcon}>↻</span> : <IoDocumentText />}
            disabled={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ModalRelatorio;
