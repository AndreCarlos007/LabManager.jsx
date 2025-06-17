// Funções utilitárias para gerenciamento de reservas
export const getFuncaoLabel = (funcao) => {
  switch (funcao) {
    case 1:
      return "Coordenador de Curso"
    case 2:
      return "Coordenador de Laboratório"
    case 3:
      return "Reitoria"
    default:
      return "Outro"
  }
}

export const podeAprovar = (reservaStatus, userFuncao) => {
  if (userFuncao === 2 && reservaStatus === 0) return true // Coord. Lab: Pendente
  if (userFuncao === 1 && reservaStatus === 1) return true // Coord. Curso: Aprovado pelo Coord. Lab
  if (userFuncao === 3 && reservaStatus === 2) return true // Reitoria: Aprovado pelo Coord. Curso
  return false
}

// Retorna apenas "Aprovado", "Pendente" ou "Rejeitado"
export const getStatusLabel = (status) => {
  if (status === 3) return "Aprovado"
  if (status === 4) return "Rejeitado"
  return "Pendente" // Status 0, 1, 2 são considerados pendentes
}

// Retorna a cor do badge com base no status
export const getStatusBadgeVariant = (status) => {
  if (status === 4) return "destructive" // Vermelho para rejeitado
  if (status === 3) return "success" // Verde para aprovado
  return "warning" // Amarelo para pendente
}

// Obtém o status de uma etapa específica (CORRIGIDO)
export const getStatusEtapa = (reserva, nivel) => {
  // Se a reserva foi rejeitada
  if (reserva.status === 4) {
    const etapaRejeicao = reserva.rejeicao?.etapa || 1
    if (nivel === etapaRejeicao) return "Rejeitada"
    if (nivel < etapaRejeicao) return "Aprovada"
    return "Pendente"
  }

  // Se a reserva foi aprovada globalmente, todas as etapas são aprovadas
  if (reserva.status === 3) {
    return "Aprovada"
  }

  // Verifica se esta etapa específica já foi aprovada
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return "Aprovada"
  }

  // Para etapas não aprovadas, verifica se é a próxima na sequência
  // Etapa 1: sempre pode estar pendente se não foi aprovada
  if (nivel === 1) {
    return "Pendente"
  }

  // Etapa 2: só pode estar pendente se etapa 1 foi aprovada
  if (nivel === 2) {
    if (reserva.aprovacoes && reserva.aprovacoes[1]) {
      return "Pendente"
    }
    return "Pendente" // Ainda não chegou sua vez
  }

  // Etapa 3: só pode estar pendente se etapas 1 e 2 foram aprovadas
  if (nivel === 3) {
    if (reserva.aprovacoes && reserva.aprovacoes[1] && reserva.aprovacoes[2]) {
      return "Pendente"
    }
    return "Pendente" // Ainda não chegou sua vez
  }

  return "Pendente"
}

// Obtém o responsável por uma etapa
export const getResponsavelEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return reserva.aprovacoes[nivel].responsavel
  }

  if (reserva.status === 4 && reserva.rejeicao && reserva.rejeicao.etapa === nivel) {
    return reserva.rejeicao.responsavel
  }

  return ""
}

// Obtém a data de uma etapa
export const getDataEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return reserva.aprovacoes[nivel].data
  }

  if (reserva.status === 4 && reserva.rejeicao && reserva.rejeicao.etapa === nivel) {
    return reserva.rejeicao.data
  }

  return ""
}

// Obtém a cor do badge para cada etapa
export const getEtapaBadgeVariant = (status) => {
  switch (status) {
    case "Aprovada":
      return "success"
    case "Rejeitada":
      return "destructive"
    case "Pendente":
      return "warning"
    default:
      return "outline"
  }
}

// Função auxiliar para determinar a etapa atual
export const getEtapaAtual = (reserva) => {
  if (reserva.status === 4) return reserva.rejeicao?.etapa || 1

  if (!reserva.aprovacoes || Object.keys(reserva.aprovacoes).length === 0) return 1
  if (!reserva.aprovacoes[1]) return 1
  if (!reserva.aprovacoes[2]) return 2
  if (!reserva.aprovacoes[3]) return 3
  return 4 // Todas aprovadas
}

/**
 * Mapeia a função do usuário para o nível de aprovação
 */
export const getFuncaoParaNivel = (userFuncao) => {
  const aprovadorMap = {
    2: 1, // CoordenadorLaboratorio -> Nível 1
    1: 2, // CoordenadorCurso -> Nível 2
    3: 3, // Reitoria -> Nível 3
  }
  return aprovadorMap[userFuncao]
}

/**
 * Atualiza os status das etapas e o status global da reserva conforme o fluxo garantido.
 * @param {Object} reserva - Objeto da reserva atual
 * @param {number} etapa - Etapa que foi aprovada ou rejeitada (1, 2 ou 3)
 * @param {'aprovar'|'rejeitar'} acao - Ação realizada
 * @param {Object} responsavel - Dados do responsável pela ação
 * @returns {Object} Novo objeto reserva atualizado
 */
export function atualizarFluxoAprovacao(reserva, etapa, acao, responsavel) {
  const novasAprovacoes = { ...(reserva.aprovacoes || {}) }
  let novoStatus = reserva.status
  let novaRejeicao = reserva.rejeicao ? { ...reserva.rejeicao } : null

  if (acao === "aprovar") {
    novasAprovacoes[etapa] = {
      responsavel: responsavel.nome || "Você",
      data: new Date().toISOString(),
    }

    // Atualiza o status global baseado na etapa aprovada
    if (etapa === 3) {
      novoStatus = 3 // Totalmente aprovado
    } else {
      novoStatus = etapa // Status avança para o próximo nível
    }
    novaRejeicao = null
  } else if (acao === "rejeitar") {
    // Marca rejeição e status global como rejeitado
    novoStatus = 4
    novaRejeicao = {
      etapa,
      responsavel: responsavel.nome || "Você",
      data: new Date().toISOString(),
    }
  }

  return {
    ...reserva,
    status: novoStatus,
    aprovacoes: novasAprovacoes,
    rejeicao: novaRejeicao,
  }
}
