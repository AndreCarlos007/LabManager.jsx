// Enums do sistema

export const FUNCOES = {
  PROFESSOR: 0,
  COORDENADOR_CURSO: 1,
  COORDENADOR_LABORATORIO: 2,
  REITORIA: 3,
  TECNICO: 4,
  AUDITOR: 5,
}

export const CURSOS = {
  ENGENHARIA_SOFTWARE: 1,
  CIENCIA_COMPUTACAO: 2,
  SISTEMAS_INFORMACAO: 3,
  ANALISE_DESENVOLVIMENTO: 4,
}

export const FUNCOES_LABELS = {
  [FUNCOES.PROFESSOR]: "Professor",
  [FUNCOES.COORDENADOR_CURSO]: "Coordenador de Curso",
  [FUNCOES.COORDENADOR_LABORATORIO]: "Coordenador de Laboratório",
  [FUNCOES.REITORIA]: "Reitoria",
  [FUNCOES.TECNICO]: "Técnico",
  [FUNCOES.AUDITOR]: "Auditor",
}

export const CURSOS_LABELS = {
  [CURSOS.ENGENHARIA_SOFTWARE]: "Engenharia de Software",
  [CURSOS.CIENCIA_COMPUTACAO]: "Ciência da Computação",
  [CURSOS.SISTEMAS_INFORMACAO]: "Sistemas de Informação",
  [CURSOS.ANALISE_DESENVOLVIMENTO]: "Análise e Desenvolvimento de Sistemas",
}

// Funções auxiliares
export const getFuncaoLabel = (funcaoId) => {
  return FUNCOES_LABELS[funcaoId] || "Função Desconhecida"
}

export const getCursoLabel = (cursoId) => {
  return CURSOS_LABELS[cursoId] || "Curso Desconhecido"
}

// Arrays para uso em selects/dropdowns
export const FUNCOES_ARRAY = Object.entries(FUNCOES_LABELS).map(([id, label]) => ({
  id: Number.parseInt(id),
  label,
}))

export const CURSOS_ARRAY = Object.entries(CURSOS_LABELS).map(([id, label]) => ({
  id: Number.parseInt(id),
  label,
}))
