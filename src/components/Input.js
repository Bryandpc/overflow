import styles from '@/styles/Input.module.css';
import { formatarValor } from '@/utils/formatadorUtils';
import { IoClose } from 'react-icons/io5';

const Input = ({
    label,
    name,
    error,
    required = false,
    onChange,
    value,
    type = 'text',
    placeholder = '',
    customClass,
    onBlur,
    multiline = false,
    rows = 4,
    formatType = null,
    ...rest
}, ref) => {

    const handleClear = () => {
        onChange({ target: { name, value: '' } });
    };

    const handleChange = (e) => {
        let newValue = e.target.value;
        
        if (formatType) newValue = formatarValor(newValue, formatType);
        
        const formattedEvent = {
            ...e,
            target: {
                ...e.target,
                value: newValue
            }
        };
        
        onChange(formattedEvent);
    };

    const inputProps = {
        ref,
        name,
        placeholder,
        required,
        onChange: formatType ? handleChange : onChange,
        value,
        onBlur,
        ...rest
    };

    return (
        <div className={`${styles.container} ${customClass}`}>
            {label && (
                <label className={styles.label}>
                    <span className={styles.textoLabel}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </span>
                </label>
            )}

            {multiline ? (
                <textarea
                    {...inputProps}
                    className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''}`}
                    rows={rows}
                />
            ) : (
                <input
                    {...inputProps}
                    type={type}
                    className={`${styles.input} ${error ? styles.error : ''}`}
                />
            )}

            {error && <span className={styles.mensagemErro}>{error}</span>}
            {value &&(
                <button
                    type='button'
                    className={styles.botaoApagar}
                    onClick={handleClear}
                >
                    <IoClose />
                </button>
            )}
        </div>
    );
}
 
export default Input;