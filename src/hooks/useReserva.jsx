"use client"
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const API_URL = "https://labmanagers-bgfbepbvgvgwd5ff.brazilsouth-01.azurewebsites.net/api";

export default function useReserva() {
  const [reservas, setReservas] = useState([]);
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    return Cookies.get('token');
  };

  const listarReservas = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/Reserva/listarReservas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao listar reservas');
      }
      
      const data = await response.json();
      setReservas(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const obterReservaPorId = useCallback(async (id) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/Reserva/obterPorId/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao obter reserva');
      }
      
      const data = await response.json();
      setReserva(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const criarReserva = useCallback(async (reservaData) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/Reserva/criarReserva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reservaData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar reserva');
      }
      
      const data = await response.json();
      toast.success('Reserva criada com sucesso!');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const aprovarReserva = useCallback(async (id, userFuncao) => {
    setLoading(true);
    try {
      const token = getToken();
      
      // Mapeia a função do usuário para o nível de aprovação
      const aprovadorMap = {
        2: 1, // CoordenadorLaboratorio -> Nível 1
        1: 2, // CoordenadorCurso -> Nível 2
        3: 3  // Reitoria -> Nível 3
      };
      
      const aprovador = aprovadorMap[userFuncao];
      if (!aprovador) {
        throw new Error('Usuário não tem permissão para aprovar reservas');
      }

      const response = await fetch(`${API_URL}/Reserva/${id}/aprovar?aprovador=${aprovador}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao aprovar reserva');
      }
      
      // Atualização otimista
      setReservas(prev => prev.map(r => 
        r.id === id ? { 
          ...r, 
          status: aprovador,
          aprovacoes: {
            ...r.aprovacoes,
            [aprovador]: {
              data: new Date().toISOString(),
              responsavel: 'Você'
            }
          }
        } : r
      ));
      
      if (reserva && reserva.id === id) {
        setReserva(prev => ({ 
          ...prev, 
          status: aprovador,
          aprovacoes: {
            ...prev.aprovacoes,
            [aprovador]: {
              data: new Date().toISOString(),
              responsavel: 'Você'
            }
          }
        }));
      }
      
      toast.success('Reserva aprovada com sucesso!');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [reserva]);

  const rejeitarReserva = useCallback(async (id) => {
    setLoading(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/Reserva/${id}/rejeitar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao rejeitar reserva');
      }
      
      // Atualização otimista
      setReservas(prev => prev.map(r => 
        r.id === id ? { 
          ...r, 
          status: 4,
          rejeicao: {
            data: new Date().toISOString(),
            responsavel: 'Você'
          }
        } : r
      ));
      
      if (reserva && reserva.id === id) {
        setReserva(prev => ({ 
          ...prev, 
          status: 4,
          rejeicao: {
            data: new Date().toISOString(),
            responsavel: 'Você'
          }
        }));
      }
      
      toast.success('Reserva rejeitada com sucesso!');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [reserva]);

  return {
    reservas,
    reserva,
    loading,
    error,
    listarReservas,
    obterReservaPorId,
    criarReserva,
    aprovarReserva,
    rejeitarReserva
  };
}