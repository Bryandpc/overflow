import { use, useEffect, useRef } from "react";
import styles from '@/styles/Modal.module.css';
import { IoClose } from "react-icons/io5";

/** * Componente Modal para exibir conteúdo em uma janela modal.
 * O estado do modal é controlado externamente através das propriedades `isOpen` e `onClose`, presentes no hook `useModal`.
 * @param {Object} props - Propriedades do componente.
 * @param {boolean} props.isOpen - Indica se o modal está aberto.
 * @param {Function} props.onClose - Função para fechar o modal.
 * @param {string} [props.titulo] - Título do modal.
 * @param {ReactNode} props.children - Conteúdo a ser exibido dentro do modal.
 */

const Modal = ({
    isOpen,
    onClose,
    titulo,
    children,
}) => {
    const modalRef = useRef(null);

    //Lógica para fechar ao clicar fora
    useEffect(() => {
       const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    //Lógica para fechar ao apertar ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {   
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;
    
    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <div className={styles.cabecalho}>
                    {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
                    <button className={styles.botaoFechar} onClick={onClose}><IoClose /></button>
                </div>
                <hr className={styles.divisor} />
                <div className={styles.conteudo}>
                    {children}
                </div>
            </div>
        </div>
    );
}
 
export default Modal;