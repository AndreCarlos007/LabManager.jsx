// Mapeamento de funções (números para nomes)
export const getFuncaoLabel = (funcao) => {
  switch(funcao) {
    case 1: return 'Coordenador de Curso';
    case 2: return 'Coordenador de Laboratório';
    case 3: return 'Reitoria';
    default: return 'Outro';
  }
};

// Determina se o usuário pode aprovar uma reserva
export const podeAprovar = (reservaStatus, userFuncao) => {
  // Coordenador de Laboratório só pode aprovar status 0 (Pendente)
  if (userFuncao === 2 && reservaStatus === 0) return true;
  
  // Coordenador de Curso só pode aprovar status 1 (Aprovado pelo Coord. Lab)
  if (userFuncao === 1 && reservaStatus === 1) return true;
  
  // Reitoria só pode aprovar status 2 (Aprovado pelo Coord. Curso)
  if (userFuncao === 3 && reservaStatus === 2) return true;
  
  return false;
};

// Retorna o label descritivo para o status
export const getStatusLabel = (status) => {
  switch(status) {
    case 0: return 'Pendente';
    case 1: return 'Aprovado Coord. Lab';
    case 2: return 'Aprovado Coord. Curso';
    case 3: return 'Aprovado Reitoria';
    case 4: return 'Rejeitado';
    default: return 'Desconhecido';
  }
};

// Retorna a cor do badge com base no status
export const getStatusBadgeVariant = (status) => {
  if (status === 4) return 'destructive';
  if (status === 3) return 'success';
  return 'secondary';
};

// Mapeia funções para níveis de aprovação
export const funcaoToAprovador = {
  2: 1, // CoordenadorLaboratorio -> Nível 1
  1: 2, // CoordenadorCurso -> Nível 2
  3: 3  // Reitoria -> Nível 3
};

// Obtém o status de uma etapa específica
export const getStatusEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return 'Aprovada';
  }
  
  if (reserva.status === 4) {
    return 'Rejeitada';
  }
  
  // Verifica se a etapa anterior foi aprovada
  if (nivel > 1) {
    const etapaAnterior = nivel - 1;
    if (!reserva.aprovacoes || !reserva.aprovacoes[etapaAnterior]) {
      return 'Não iniciada';
    }
  }
  
  return 'Pendente';
};

// Obtém o responsável por uma etapa
export const getResponsavelEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return reserva.aprovacoes[nivel].responsavel;
  }
  
  if (reserva.status === 4 && reserva.rejeicao) {
    return reserva.rejeicao.responsavel;
  }
  
  return '';
};

// Obtém a data de uma etapa
export const getDataEtapa = (reserva, nivel) => {
  if (reserva.aprovacoes && reserva.aprovacoes[nivel]) {
    return reserva.aprovacoes[nivel].data;
  }
  
  if (reserva.status === 4 && reserva.rejeicao) {
    return reserva.rejeicao.data;
  }
  
  return '';
};