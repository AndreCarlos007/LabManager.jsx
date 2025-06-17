// Funções utilitárias para gerenciamento de reservas
export const getFuncaoLabel = (funcao) => {
  switch(funcao) {
    case 1: return 'Coordenador de Curso';
    case 2: return 'Coordenador de Laboratório';
    case 3: return 'Reitoria';
    default: return 'Outro';
  }
};

export const podeAprovar = (reservaStatus, userFuncao) => {
  if (userFuncao === 2 && reservaStatus === 0) return true;   // Coord. Lab: Pendente
  if (userFuncao === 1 && reservaStatus === 1) return true;   // Coord. Curso: Aprovado pelo Coord. Lab
  if (userFuncao === 3 && reservaStatus === 2) return true;   // Reitoria: Aprovado pelo Coord. Curso
  return false;
};

// Retorna apenas "Aprovado", "Pendente" ou "Rejeitado"
export const getStatusLabel = (status) => {
  if (status === 3) return 'Aprovado';
  if (status === 4) return 'Rejeitado';
  return 'Pendente'; // Status 0, 1, 2 são considerados pendentes
};

// Retorna a cor do badge com base no status
export const getStatusBadgeVariant = (status) => {
  if (status === 4) return 'destructive';   // Vermelho para rejeitado
  if (status === 3) return 'success';       // Verde para aprovado
  return 'warning';                        // Amarelo para pendente
};

// Obtém o status de uma etapa específica (CORRIGIDO)
export const getStatusEtapa = (reserva, nivel) => {
  // Se a reserva foi rejeitada
  if (reserva.status === 4) {
    const etapaRejeicao = reserva.rejeicao?.etapa || 1;
    if (nivel === etapaRejeicao) return 'Rejeitada';
    if (nivel < etapaRejeicao) return 'Aprovada';
    return 'Pendente';
  }

  // Se a reserva foi aprovada globalmente, todas as etapas são aprovadas
  if (reserva.status === 3) {
    return 'Aprovada';
  }

  // Verifica se esta etapa específica já foi aprovada
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return 'Aprovada';
  }

  // Determina qual é a próxima etapa pendente
  let proximaEtapa = 1;
  if (reserva.aprovacoes) {
    if (reserva.aprovacoes[1]) proximaEtapa = 2;
    if (reserva.aprovacoes[2]) proximaEtapa = 3;
    if (reserva.aprovacoes[3]) proximaEtapa = 4;
  }

  // Se esta é a próxima etapa pendente
  if (nivel === proximaEtapa) {
    return 'Pendente';
  }

  // Se é uma etapa futura
  if (nivel > proximaEtapa) {
    return 'Pendente';
  }

  // Se é uma etapa anterior não aprovada (não deveria acontecer)
  return 'Pendente';
};

// Obtém o responsável por uma etapa
export const getResponsavelEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return reserva.aprovacoes[nivel].responsavel;
  }
  
  if (reserva.status === 4 && reserva.rejeicao && reserva.rejeicao.etapa === nivel) {
    return reserva.rejeicao.responsavel;
  }
  
  return '';
};

// Obtém a data de uma etapa
export const getDataEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return reserva.aprovacoes[nivel].data;
  }
  
  if (reserva.status === 4 && reserva.rejeicao && reserva.rejeicao.etapa === nivel) {
    return reserva.rejeicao.data;
  }
  
  return '';
};

// Obtém a cor do badge para cada etapa
export const getEtapaBadgeVariant = (status) => {
  switch(status) {
    case 'Aprovada': return 'success';
    case 'Rejeitada': return 'destructive';
    case 'Pendente': return 'warning';
    default: return 'outline';
  }
};

// Obtém ícone para cada status de etapa
export const getEtapaIcon = (status) => {
  switch(status) {
    case 'Aprovada': return <Check className="h-4 w-4" />;
    case 'Rejeitada': return <X className="h-4 w-4" />;
    case 'Pendente': return <Clock className="h-4 w-4" />;
    default: return <CircleDashed className="h-4 w-4" />;
  }
};

// Função auxiliar para obter a cor de fundo do ícone
export const getBgColorEtapa = (status) => {
  switch(status) {
    case 'Aprovada': return 'bg-green-500';
    case 'Rejeitada': return 'bg-red-500';
    case 'Pendente': return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
};

// Função auxiliar para determinar a etapa atual
export const getEtapaAtual = (reserva) => {
  if (reserva.status === 4) return reserva.rejeicao?.etapa || 1;
  
  if (!reserva.aprovacoes || Object.keys(reserva.aprovacoes).length === 0) return 1;
  if (!reserva.aprovacoes[1]) return 1;
  if (!reserva.aprovacoes[2]) return 2;
  if (!reserva.aprovacoes[3]) return 3;
  return 4; // Todas aprovadas
};

/**
 * Atualiza os status das etapas e o status global da reserva conforme o fluxo garantido.
 * @param {Object} reserva - Objeto da reserva atual
 * @param {number} etapa - Etapa que foi aprovada ou rejeitada (1, 2 ou 3)
 * @param {'aprovar'|'rejeitar'} acao - Ação realizada
 * @param {Object} responsavel - Dados do responsável pela ação
 * @returns {Object} Novo objeto reserva atualizado
 */
export function atualizarFluxoAprovacao(reserva, etapa, acao, responsavel) {
  const novasAprovacoes = { ...(reserva.aprovacoes || {}) };
  let novoStatus = reserva.status;
  let novaRejeicao = reserva.rejeicao ? { ...reserva.rejeicao } : null;

  if (acao === 'aprovar') {
    novasAprovacoes[etapa] = {
      responsavel: responsavel.nome,
      data: new Date().toISOString(),
    };
    
    // Se aprovou a última etapa, status global é aprovado
    if (etapa === 3) {
      novoStatus = 3;
    } else {
      // Status global avança para o próximo estágio
      novoStatus = etapa;
    }
    novaRejeicao = null;
  } else if (acao === 'rejeitar') {
    // Marca rejeição e status global como rejeitado
    novoStatus = 4;
    novaRejeicao = {
      etapa,
      responsavel: responsavel.nome,
      data: new Date().toISOString(),
    };
  }

  return {
    ...reserva,
    status: novoStatus,
    aprovacoes: novasAprovacoes,
    rejeicao: novaRejeicao,
  };
}