"use client";
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const API_URL = "https://labmanagers-bgfbepbvgvgwd5ff.brazilsouth-01.azurewebsites.net/api";

const getToken = () => Cookies.get('token');

// Funções da API
const obterTodasTurmas = async () => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado");

  const response = await fetch(`${API_URL}/Turma/obterTodas`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Falha ao listar turmas');
  }

  return response.json();
};

const obterTurmaPorId = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado");

  const response = await fetch(`${API_URL}/Turma/obterPorId/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Falha ao obter turma');
  }

  return response.json();
};

const criarTurma = async (turmaData) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado");

  const response = await fetch(`${API_URL}/Turma/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(turmaData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Falha ao criar turma');
  }

  return response.json();
};

const atualizarTurma = async (id, turmaData) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado");

  const response = await fetch(`${API_URL}/Turma/atualizar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(turmaData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Falha ao atualizar turma');
  }

  return response.json();
};

const deletarTurma = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado");

  const response = await fetch(`${API_URL}/Turma/deletar/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Falha ao excluir turma');
  }

  return true;
};

// Hook personalizado
export default function useTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarTurmas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obterTodasTurmas();
      setTurmas(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarTurmaPorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obterTurmaPorId(id);
      setTurma(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarTurma = useCallback(async (turmaData) => {
    setLoading(true);
    setError(null);
    try {
      const nova = await criarTurma(turmaData);
      setTurmas(prev => [...prev, nova]);
      toast.success('Turma criada com sucesso!');
      return nova;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editarTurma = useCallback(async (id, turmaData) => {
    setLoading(true);
    setError(null);
    try {
      const atualizada = await atualizarTurma(id, turmaData);
      setTurmas(prev => prev.map(t => t.id === id ? atualizada : t));
      setTurma(atualizada);
      toast.success('Turma atualizada com sucesso!');
      return atualizada;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removerTurma = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deletarTurma(id);
      setTurmas(prev => prev.filter(t => t.id !== id));
      setTurma(null);
      toast.success('Turma excluída com sucesso!');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    turmas,
    turma,
    loading,
    error,
    listarTurmas,
    carregarTurmas: listarTurmas,
    carregarTurmaPorId,
    adicionarTurma,
    editarTurma,
    removerTurma
  };
}
