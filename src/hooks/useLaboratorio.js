"use client"
import { useState, useEffect } from 'react';
import { 
  listarLaboratorios, 
  criarLaboratorio, 
  atualizarLaboratorio, 
  obterLaboratorioPorId, 
  deletarLaboratorio,
  atualizarStatusManutencao
} from '../lib/api/laboratorio';

export default function useLaboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratorio, setLaboratorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarLaboratorios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarLaboratorios();
      setLaboratorios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarLaboratorioPorId = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterLaboratorioPorId(id);
      setLaboratorio(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const adicionarLaboratorio = async (laboratorioData) => {
    try {
      setLoading(true);
      setError(null);
      const novoLaboratorio = await criarLaboratorio(laboratorioData);
      setLaboratorios(prev => [...prev, novoLaboratorio]);
      return novoLaboratorio;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editarLaboratorio = async (id, laboratorioData) => {
    try {
      setLoading(true);
      setError(null);
      const laboratorioAtualizado = await atualizarLaboratorio(id, laboratorioData);
      setLaboratorios(prev => prev.map(l => l.id === id ? laboratorioAtualizado : l));
      setLaboratorio(laboratorioAtualizado);
      return laboratorioAtualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removerLaboratorio = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deletarLaboratorio(id);
      setLaboratorios(prev => prev.filter(l => l.id !== id));
      setLaboratorio(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleManutencao = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      await atualizarStatusManutencao(id, status);
      await carregarLaboratorios();
      if (laboratorio?.id === id) {
        await carregarLaboratorioPorId(id);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    laboratorios,
    laboratorio,
    loading,
    error,
    carregarLaboratorios,
    carregarLaboratorioPorId,
    adicionarLaboratorio,
    editarLaboratorio,
    removerLaboratorio,
    toggleManutencao
  };
}