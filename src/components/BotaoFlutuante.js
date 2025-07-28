'use client'

import styles from '@/styles/BotaoFlutuante.module.css'

const TipoBotao = {
    BUTTON: 'button',
    SUBMIT: 'submit',
    RESET: 'reset'
};

const BotaoFlutuante = ({
    aoClicar,
    customClass,
    texto,
    icone,
    iconeAcima,
    type = TipoBotao.BUTTON,
    isCancelar = false
}) => {
    
    const buttonClassName = `${styles.botaoFlutuante} 
                            ${iconeAcima ? styles.botaoFlutuanteVertical : ''} 
                            ${isCancelar ? styles.botaoFlutuanteCancelar : ''}
                            ${customClass || ''}`.trim();
    
    return (
        <button 
            className={buttonClassName}
            onClick={aoClicar}
            type={type}
        >
            {icone && <span className={iconeAcima ? styles.iconeAcima : styles.icone}>{icone}</span>}    
            {texto && <span className={styles.texto}>{texto}</span>}
        </button>
    )
}

BotaoFlutuante.Tipos = TipoBotao;

export default BotaoFlutuante