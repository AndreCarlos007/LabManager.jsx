
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://labmanagers-bgfbepbvgvgwd5ff.brazilsouth-01.azurewebsites.net";

const getToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};

export const listarLaboratorios = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Laboratorio/listar`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao listar laboratórios');
  }

  return res.json();
};

export const criarLaboratorio = async (laboratorioData) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Laboratorio/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(laboratorioData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao criar laboratório');
  }

  return res.json();
};

export const atualizarLaboratorio = async (id, laboratorioData) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Laboratorio/atualizar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(laboratorioData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao atualizar laboratório');
  }

  return res.json();
};

export const obterLaboratorioPorId = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Laboratorio/obterPorId/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao obter laboratório');
  }

  return res.json();
};

export const deletarLaboratorio = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Laboratorio/deletar/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao deletar laboratório');
  }

  return res.json();
};

export const atualizarStatusManutencao = async (id, emManutencao) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/Laboratorio/${id}/manutencao`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ emManutencao }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Falha ao atualizar status de manutenção');
  }

  return res.json();
};