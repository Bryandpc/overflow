'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Dashboard.module.css';
import { useTrabalhosSemana, useTrabalhosSemanaAnterior, useTrabalhosMes } from '@/hooks/useTrabalhos';
import DashboardUtils from '@/utils/dashboardUtils';
import CalculoUtils from '@/utils/calculoUtils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { MdArrowUpward, MdArrowDownward, MdHorizontalRule } from 'react-icons/md';

const Dashboard = () => {
  const { data: trabalhosSemana, isLoading: isLoadingSemana } = useTrabalhosSemana();
  const { data: trabalhosSemanaAnterior, isLoading: isLoadingSemanaAnterior } = useTrabalhosSemanaAnterior();
  const { data: trabalhosMes, isLoading: isLoadingMes } = useTrabalhosMes();
  const [dadosGraficoDias, setDadosGraficoDias] = useState([]);
  const [dadosGraficoPrioridade, setDadosGraficoPrioridade] = useState([]);
  const [comparativoSemanas, setComparativoSemanas] = useState(null);

  useEffect(() => {
    if (trabalhosMes) {
      const dadosGraficoDiasProcessado = DashboardUtils.processarDadosGraficoDias(trabalhosMes);
      const dadosGraficoPrioridadeProcessado = DashboardUtils.processarDadosGraficoPrioridade(trabalhosMes);
      
      const temSabado = dadosGraficoDiasProcessado.some(item => item.dia === 'Sábado');
      
      if (dadosGraficoDiasProcessado.length !== 7) {
        console.warn(`Esperado 7 dias, mas encontrado ${dadosGraficoDiasProcessado.length}`);
      }
      
      setDadosGraficoDias(dadosGraficoDiasProcessado);
      setDadosGraficoPrioridade(dadosGraficoPrioridadeProcessado);
    }
  }, [trabalhosMes]);
  
  useEffect(() => {
    if (trabalhosSemana && trabalhosSemanaAnterior) {
      const comparativo = CalculoUtils.compararPeriodos(trabalhosSemana, trabalhosSemanaAnterior);
      
      // Garantir que os valores formatados existam
      if (!comparativo.totalHorasFormatadoAtual) {
        comparativo.totalHorasFormatadoAtual = '00:00';
      }
      if (!comparativo.totalHorasFormatadoAnterior) {
        comparativo.totalHorasFormatadoAnterior = '00:00';
      }
      
      setComparativoSemanas(comparativo);
    }
  }, [trabalhosSemana, trabalhosSemanaAnterior]);

  if (isLoadingSemana || isLoadingSemanaAnterior || isLoadingMes) {
    return <div className={styles.loading}>Carregando dados...</div>;
  }

  return (
    <div className={styles.container}>
      {comparativoSemanas && (
        <div className={styles.infoGraficos}>
          <div className={styles.comparativoSemanas}>
            <h3>Comparativo semanal</h3>
            
            <div className={styles.indicadoresComparativo}>
              <div className={`${styles.indicador} ${styles[comparativoSemanas.tendencia]}`}>
                {comparativoSemanas.tendencia === 'aumento' && <MdArrowUpward className={styles.iconeIndicador} />}
                {comparativoSemanas.tendencia === 'diminuição' && <MdArrowDownward className={styles.iconeIndicador} />}
                {comparativoSemanas.tendencia === 'estável' && <MdHorizontalRule className={styles.iconeIndicador} />}
                
                <div className={styles.indicadorTexto}>
                  <span className={styles.valorIndicador}>{comparativoSemanas.percentual}%</span>
                  <span className={styles.descricaoIndicador}>
                    {comparativoSemanas.tendencia === 'aumento' ? 'a mais que na semana anterior' : 
                     comparativoSemanas.tendencia === 'diminuição' ? 'a menos que na semana anterior' : 
                     'mesmo tempo que na semana anterior'}
                  </span>
                </div>
              </div>
              
              <div className={styles.detalhesHoras}>
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Esta semana:</span>
                  <span className={styles.detalheValor}>
                    {comparativoSemanas.totalHorasFormatadoAtual 
                      ? `${comparativoSemanas.totalHorasFormatadoAtual} h` 
                      : '00:00 h'}
                  </span>
                </div>
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Semana anterior:</span>
                  <span className={styles.detalheValor}>
                    {comparativoSemanas.totalHorasFormatadoAnterior 
                      ? `${comparativoSemanas.totalHorasFormatadoAnterior} h` 
                      : '00:00 h'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.graficosWrapper}>
        <div className={styles.grafico}>
          <h3>Distribuição por Dia (Mensal)</h3>
          {dadosGraficoDias.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={dadosGraficoDias} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barGap={2}
                barCategoryGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dia" 
                  interval={0}
                  tickFormatter={(value) => value} 
                  axisLine={true}
                  tick={{ fontSize: 12 }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} 
                  allowDecimals={true} 
                  domain={[0, 'auto']}
                />
                <Tooltip formatter={(value, name, props) => {
                  const item = dadosGraficoDias.find(d => d.dia === props.payload.dia);
                  return [item ? `${item.horasFormatadas} h` : '00:00 h', 'Tempo'];
                }} />
                <Bar 
                  dataKey="horas" 
                  fill="var(--roxo-principal)" 
                  radius={[4, 4, 0, 0]} 
                  minPointSize={3} 
                  name="Horas"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.graficoPlaceholder}>
              <p>Sem dados suficientes para exibir o gráfico</p>
            </div>
          )}
        </div>
        
        <div className={styles.grafico}>
          <h3>Distribuição por Prioridade (Mensal)</h3>
          {dadosGraficoPrioridade.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficoPrioridade}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="nome"
                >
                  {dadosGraficoPrioridade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => {
                  const item = dadosGraficoPrioridade.find(d => d.nome === name);
                  return [item ? `${item.valorFormatado} h` : '00:00 h', 'Tempo'];
                }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.graficoPlaceholder}>
              <p>Sem dados suficientes para exibir o gráfico</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
