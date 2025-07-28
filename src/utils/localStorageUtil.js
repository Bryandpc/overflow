const CHAVES_STORAGE = {
  TODOS: 'overflow-todos',
  CONFIGURACOES: 'overflow-config',
  USUARIO: 'overflow-usuario'
}

const tratarErroStorage = (erro, operacao) => {
  console.error(`Erro no localStorage durante ${operacao}:`, erro)
  return null
}

export const salvarNoStorage = (chave, dados) => {
  try {
    const dadosString = JSON.stringify(dados)
    localStorage.setItem(chave, dadosString)
    return true
  } catch (erro) {
    tratarErroStorage(erro, 'salvar')
    return false
  }
}

export const buscarDoStorage = (chave, valorPadrao = null) => {
  try {
    const dadosString = localStorage.getItem(chave)
    if (dadosString === null) {
      return valorPadrao
    }
    return JSON.parse(dadosString)
  } catch (erro) {
    tratarErroStorage(erro, 'buscar')
    return valorPadrao
  }
}

export const removerDoStorage = (chave) => {
  try {
    localStorage.removeItem(chave)
    return true
  } catch (erro) {
    tratarErroStorage(erro, 'remover')
    return false
  }
}

export const salvarNomeUsuario = (nome) => {
  return salvarNoStorage(CHAVES_STORAGE.USUARIO, { nome })
}

export const buscarNomeUsuario = () => {
  const dadosUsuario = buscarDoStorage(CHAVES_STORAGE.USUARIO)
  return dadosUsuario ? dadosUsuario.nome : null
}

export const temNomeUsuario = () => {
  return buscarNomeUsuario() !== null
}

export const limparTodosOsDados = () => {
  try {
    Object.values(CHAVES_STORAGE).forEach(chave => {
      localStorage.removeItem(chave)
    })
    return true
  } catch (erro) {
    tratarErroStorage(erro, 'limpar tudo')
    return false
  }
}

export const buscarTodos = () => {
  return buscarDoStorage(CHAVES_STORAGE.TODOS, [])
}

export const salvarTodos = (todos) => {
  return salvarNoStorage(CHAVES_STORAGE.TODOS, todos)
}

export const adicionarTodo = (novoTodo) => {
  const todosAtuais = buscarTodos()
  const todoComId = {
    ...novoTodo,
    id: Date.now().toString(),
    criadoEm: new Date().toISOString(),
    concluido: false
  }
  
  const todosAtualizados = [...todosAtuais, todoComId]
  const sucesso = salvarTodos(todosAtualizados)
  
  return sucesso ? todoComId : null
}

export const atualizarTodo = (id, dadosAtualizados) => {
  const todosAtuais = buscarTodos()
  const indice = todosAtuais.findIndex(todo => todo.id === id)
  
  if (indice === -1) {
    console.warn(`Todo com ID ${id} não encontrado`)
    return false
  }
  
  todosAtuais[indice] = {
    ...todosAtuais[indice],
    ...dadosAtualizados,
    atualizadoEm: new Date().toISOString()
  }
  
  return salvarTodos(todosAtuais)
}

export const removerTodo = (id) => {
  const todosAtuais = buscarTodos()
  const todosFiltrados = todosAtuais.filter(todo => todo.id !== id)
  
  if (todosFiltrados.length === todosAtuais.length) {
    console.warn(`Todo com ID ${id} não encontrado`)
    return false
  }
  
  return salvarTodos(todosFiltrados)
}

export const alternarConclusaoTodo = (id) => {
  const todosAtuais = buscarTodos()
  const todo = todosAtuais.find(t => t.id === id)
  
  if (!todo) {
    console.warn(`Todo com ID ${id} não encontrado`)
    return false
  }
  
  return atualizarTodo(id, { 
    concluido: !todo.concluido,
    concluidoEm: !todo.concluido ? new Date().toISOString() : null
  })
}

export const buscarTodosPorPeriodo = (dataInicio, dataFim) => {
  const todos = buscarTodos()
  
  return todos.filter(todo => {
    const dataTodo = new Date(todo.criadoEm)
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    
    return dataTodo >= inicio && dataTodo <= fim
  })
}

export const localStorageDisponivel = () => {
  try {
    const teste = 'teste-localStorage'
    localStorage.setItem(teste, teste)
    localStorage.removeItem(teste)
    return true
  } catch {
    return false
  }
}

export { CHAVES_STORAGE }
