import { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";
import styles from '@/styles/Select.module.css';

const Select = ({
    label,
    name,
    error,
    required = false,
    onChange,
    value,
    options = [],
    placeholder = 'Selecione uma opção',
    customClass,
    onBlur,
    ...rest
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const opcaoSelecionada = options.find(option => option.value === value);

    const handleOptionClick = (option) => {
        onChange({ target: { name, value: option.value } });
        setIsOpen(!isOpen);
        if (onBlur) onBlur();
    };

    const handleClear = (e) => {
        e.stopPropagation(); 
        onChange({ target: { name, value: '' } });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
                if (onBlur) onBlur();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onBlur]);

    return (
        <div  className={`${styles.container} ${customClass || ''}`} ref={selectRef}>
            {label && (
                <label className={styles.label}>
                    <span className={styles.textoLabel}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </span>
                </label>
            )}

            <div 
                className={`${styles.selectBox} ${error ? styles.error : ''} ${value ? styles.valorSelecionado : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                ref={ref}
                {...rest}
            >
                <div className={styles.selectValue}>
                    {opcaoSelecionada ? opcaoSelecionada.label : <span className={styles.placeholder}>{placeholder}</span>}
                </div>
                {value && (
                    <button
                        type='button'
                        className={styles.botaoApagar}
                        onClick={handleClear}
                        aria-label="Limpar seleção"
                    >
                        <IoClose />
                    </button>
                )}
                <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
                    <IoChevronDown />
                </div>
            </div>

            {isOpen && (
               <div className={`${styles.options} scroll-roxo`}>
                    {options.length > 0 ? 
                        options.map((option) => (
                            <div 
                                key={option.value} 
                                className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.label}
                            </div>
                        ))
                        :
                        <div className={styles.noOptions}>Sem opções disponíveis</div>
                    }
                </div>
            )}

            {error && <span className={styles.mensagemErro}>{error}</span>}
        </div>
    );
}
 
export default Select;