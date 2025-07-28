'use client'

import ResumoSemana from './ResumoSemana'
import styles from '@/styles/Cabecalho.module.css'
import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'
import animationData from '../../public/lottie/overflow.json'

const Cabecalho = () => {
    const [dataFormatada, setDataFormatada] = useState('')

    useEffect(() => {
        const agora = new Date()
        const formatada = agora.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        setDataFormatada(formatada)
    }, [])

    return ( 
        <header className={styles.containerCabecalho}>
            <div className={styles.infoBasica}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px' }}>
                        <Lottie 
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            speed={0.5}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                    <h1 className={styles.titulo}>OverFlow</h1>
                </div>
                <time className={styles.data}>{dataFormatada}</time>
            </div>
            
            <ResumoSemana />
        </header>
    );
}
 
export default Cabecalho;