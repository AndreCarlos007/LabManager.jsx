// src/lib/api/turmas.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://labmanagers-bgfbepbvgvgwd5ff.brazilsouth-01.azurewebsites.net";

const getToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};

export const obterTodasTurmas = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Turma/obterTodas`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao obter turmas');
  }

  return res.json();
};

export const criarTurma = async (turmaData) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Turma/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(turmaData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao criar turma');
  }

  return res.json();
};

export const atualizarTurma = async (id, turmaData) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Turma/atualizar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(turmaData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao atualizar turma');
  }

  return res.json();
};

export const obterTurmaPorId = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Turma/obterPorId/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao obter turma');
  }

  return res.json();
};

export const deletarTurma = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Turma/deletar/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao deletar turma');
  }

  // Se for 204, retorna null (ou true)
  if (res.status === 204) {
    return null; // ou return true;
  }

  return res.json(); // Caso o back retorne algo
};