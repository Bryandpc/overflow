import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { formatarData } from '@/utils/formatadorUtils';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5Q.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAw.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1px solid #CCCCCC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 11,
    color: '#666666',
  },
  userInfo: {
    fontSize: 11,
    color: '#333333',
    fontWeight: 'bold',
  },
  appInfo: {
    fontSize: 11,
    color: '#666666',
  },
  period: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666666',
  },
  summary: {
    marginBottom: 20,
  },
  statisticsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    padding: 10,
    borderRadius: 5,
    width: '23%',
    alignItems: 'center',
  },
  lowPriority: {
    backgroundColor: '#E6F4EA',
  },
  mediumPriority: {
    backgroundColor: '#FEF7E6',
  },
  highPriority: {
    backgroundColor: '#FEEAE6',
  },
  urgentPriority: {
    backgroundColor: '#EEE6F4',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
  },
  totalHours: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    fontSize: 9,
  },
  col1: { width: '30%', paddingHorizontal: 3 },
  col2: { width: '40%', paddingHorizontal: 3 },
  col3: { width: '15%', paddingHorizontal: 3, textAlign: 'center' },
  col4: { width: '15%', paddingHorizontal: 3 },
  colContent: {
    width: '100%',
  },
  priorityTag: {
    padding: '2px 4px',
    borderRadius: 8,
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'block',
    margin: '0 auto',
    width: '80%',
  },
  baixa: {
    backgroundColor: '#E6F4EA',
    color: '#2F855A',
  },
  media: {
    backgroundColor: '#FEF7E6',
    color: '#D97706',
  },
  alta: {
    backgroundColor: '#FEEAE6',
    color: '#F56565',
  },
  urgente: {
    backgroundColor: '#EEE6F4',
    color: '#6B46C1',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    textAlign: 'center',
    color: '#888888',
    fontSize: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#888888',
  },
  content: {
    flex: 1,
    marginBottom: 60,
  },
});

/**
 * Componente para gerar um PDF do relatório
 * @param {Object} props 
 * @param {Array} props.trabalhos - Lista de trabalhos para incluir no relatório
 * @param {Object} props.periodo - Objeto com dataInicio e dataFim
 * @param {Object} props.estatisticas - Estatísticas dos trabalhos por prioridade
 * @param {Object} props.horasTrabalhadas - Informação sobre horas trabalhadas
 * @param {string} props.nomeUsuario - Nome do usuário para personalizar o relatório
 */
const RelatorioPDF = ({ trabalhos, periodo, estatisticas, horasTrabalhadas, nomeUsuario }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Trabalhos</Text>
        
        <View style={styles.headerInfo}>
          <Text style={styles.userInfo}>
            {nomeUsuario ? `Usuário: ${nomeUsuario}` : 'Usuário não informado'}
          </Text>
          <Text style={styles.appInfo}>
            Overflow - Gerado em {formatarData(new Date())}
          </Text>
        </View>
        
        <Text style={styles.period}>
          Período: {formatarData(periodo.dataInicio)} a {formatarData(periodo.dataFim)}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.summary}>
          <Text style={styles.totalHours}>
            Total de horas trabalhadas: {horasTrabalhadas.totalFormatado}
          </Text>

          <Text style={styles.statisticsHeader}>Trabalhos por Prioridade</Text>
          
          <View style={styles.statsRow}>
            {estatisticas.baixa > 0 && (
              <View style={[styles.statCard, styles.lowPriority]}>
                <Text style={styles.statValue}>{estatisticas.baixa}</Text>
                <Text style={styles.statLabel}>Baixa</Text>
              </View>
            )}

            {estatisticas.media > 0 && (
              <View style={[styles.statCard, styles.mediumPriority]}>
                <Text style={styles.statValue}>{estatisticas.media}</Text>
                <Text style={styles.statLabel}>Média</Text>
              </View>
            )}

            {estatisticas.alta > 0 && (
              <View style={[styles.statCard, styles.highPriority]}>
                <Text style={styles.statValue}>{estatisticas.alta}</Text>
                <Text style={styles.statLabel}>Alta</Text>
              </View>
            )}

            {estatisticas.urgente > 0 && (
              <View style={[styles.statCard, styles.urgentPriority]}>
                <Text style={styles.statValue}>{estatisticas.urgente}</Text>
                <Text style={styles.statLabel}>Urgente</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.itemsTitle}>Detalhamento dos Trabalhos</Text>
        
        <View style={styles.tableHeader} fixed>
          <View style={styles.col1}>
            <Text style={styles.colContent}>Título</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colContent}>Descrição</Text>
          </View>
          <View style={styles.col3}>
            <Text style={styles.colContent}>Prioridade</Text>
          </View>
          <View style={styles.col4}>
            <Text style={styles.colContent}>Horário</Text>
          </View>
        </View>
        
        {trabalhos.map((trabalho) => (
          <View style={styles.tableRow} key={trabalho.id} wrap={false}>
            <View style={styles.col1}>
              <Text style={styles.colContent}>{trabalho.titulo}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.colContent}>{trabalho.descricao}</Text>
            </View>
            <View style={styles.col3}>
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.priorityTag, styles[trabalho.prioridade]]}>
                  {trabalho.prioridade}
                </Text>
              </View>
            </View>
            <View style={styles.col4}>
              <Text style={styles.colContent}>
                {trabalho.horaInicio} - {trabalho.horaFim}
                {'\n'}
                <Text style={{ fontSize: 7, color: '#666666' }}>
                  {formatarData(trabalho.dataCriacao)}
                </Text>
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} 
        fixed 
      />
    </Page>
  </Document>
);

export default RelatorioPDF;
