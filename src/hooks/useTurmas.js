// src/hooks/useTurmas.js
"use client"
import { useState, useEffect } from 'react';
import { 
  obterTodasTurmas, 
  criarTurma, 
  atualizarTurma, 
  obterTurmaPorId, 
  deletarTurma 
} from '@/lib/api/turmas';

export default function useTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterTodasTurmas();
      setTurmas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarTurmaPorId = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterTurmaPorId(id);
      setTurma(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const adicionarTurma = async (turmaData) => {
    try {
      setLoading(true);
      setError(null);
      const novaTurma = await criarTurma(turmaData);
      setTurmas(prev => [...prev, novaTurma]);
      return novaTurma;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editarTurma = async (id, turmaData) => {
    try {
      setLoading(true);
      setError(null);
      const turmaAtualizada = await atualizarTurma(id, turmaData);
      setTurmas(prev => prev.map(t => t.id === id ? turmaAtualizada : t));
      setTurma(turmaAtualizada);
      return turmaAtualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removerTurma = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deletarTurma(id);
      setTurmas(prev => prev.filter(t => t.id !== id));
      setTurma(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    turmas,
    turma,
    loading,
    error,
    carregarTurmas,
    carregarTurmaPorId,
    adicionarTurma,
    editarTurma,
    removerTurma
  };
}