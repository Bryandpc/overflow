'use client'

import styles from '@/styles/ResumoSemana.module.css'
import CalculoUtils from '@/utils/calculoUtils'
import { useTrabalhosSemana, useTrabalhosMes } from '@/hooks/useTrabalhos'

const ResumoSemana = () => {
    const { data: trabalhosSemana, isLoading: isLoadingSemana, error: errorSemana } = useTrabalhosSemana()
    const { data: trabalhosMes, isLoading: isLoadingMes, error: errorMes } = useTrabalhosMes()

    if (isLoadingSemana || isLoadingMes) {
        return (
            <div className={styles.resumo}>
                <div className={styles.loading}>Carregando...</div>
            </div>
        )
    }

    if (errorSemana || errorMes) {
        return (
            <div className={styles.resumo}>
                <div className={styles.erro}>Erro ao carregar dados</div>
            </div>
        )
    }

    const horasTrabalhadasSemana = CalculoUtils.calcularHorasTrabalhadas(trabalhosSemana);
    const horasTrabalhadasMes = CalculoUtils.calcularHorasTrabalhadas(trabalhosMes);

    return (
        <div className={styles.resumo}>
            <div className={styles.estatistica}>
                <span className={styles.valor}>{horasTrabalhadasSemana.totalFormatado}</span>
                <span className={styles.label}>Esta semana</span>
            </div>
            <div className={styles.estatistica}>
                <span className={styles.valor}>{horasTrabalhadasMes.totalFormatado}</span>
                <span className={styles.label}>Este mês</span>
            </div>
        </div>
    )
}

export default ResumoSemana
