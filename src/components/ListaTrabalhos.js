import { useTrabalhos, useRemoveTrabalho } from '@/hooks/useTrabalhos';
import styles from '@/styles/ListaTrabalhos.module.css';
import { IoCreate, IoTrash } from 'react-icons/io5';
import { formatarDataTrabalhoComDiaSemana } from '@/utils/dataUtils';
import { calcularPercentualHoraExtra, getInfoHoraExtra, isFeriado } from '@/utils/percentualUtils';

const ListaTrabalhos = ({ onEditarTrabalho }) => {
    const { data: trabalhos, isLoading, isError } = useTrabalhos();
    const { mutate: removerTrabalho, isLoading: isRemoving } = useRemoveTrabalho();
    
    if (isLoading) return <div className={styles.loading}>Carregando trabalhos...</div>;
    if (isError) return <div className={styles.error}>Erro ao carregar trabalhos</div>;
    if (!trabalhos || trabalhos.length === 0) return <div className={styles.empty}>Nenhum trabalho encontrado</div>;
    
    const handleRemover = (id) => {
        removerTrabalho(id);
    };
    
    return (
        <div className={`${styles.listaContainer} scroll-roxo`}>
            {trabalhos.map((trabalho) => (
                <div key={trabalho.id} className={`${styles.trabalhoCard} ${styles[trabalho.prioridade]}`}>
                    <div className={styles.cabecalhoCard}>
                        <div className={styles.tituloArea}>
                            <h3>
                                {trabalho.titulo} 
                                <span className={styles.dataCriacao}> - {formatarDataTrabalhoComDiaSemana(trabalho.dataCriacao, trabalho.horaInicio, trabalho.horaFim)}</span>
                            </h3>
                            <span className={styles.horario}>
                                Horário: {trabalho.horaInicio} - {trabalho.horaFim}
                            </span>
                        </div>
                        <div>
                            <span className={`${styles.prioridade} ${styles[trabalho.prioridade]}`}>
                                {trabalho.prioridade}
                            </span>
                            <span className={styles.percentual}>
                                {calcularPercentualHoraExtra(trabalho.dataCriacao)}
                                {isFeriado(trabalho.dataCriacao) && <span className={styles.tag}>Feriado</span>}
                            </span>
                        </div>
                    </div>
                    <p className={styles.descricao}>{trabalho.descricao}</p>
                    <div className={styles.cardActions}>
                        {onEditarTrabalho && (
                            <button 
                                onClick={() => onEditarTrabalho(trabalho)} 
                                className={styles.btnEditar}
                                disabled={isRemoving}
                            >
                                <IoCreate /> Editar
                            </button>
                        )}
                        <button 
                            onClick={() => handleRemover(trabalho.id)} 
                            className={styles.btnRemover}
                            disabled={isRemoving}
                        >
                            <IoTrash /> Remover
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListaTrabalhos;
