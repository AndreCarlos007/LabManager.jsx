"use client";
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus, Search } from 'lucide-react';
import ReservaLista from '../../../components/reservas/ReservaLista';
import ReservaForm from '../../../components/reservas/ReservaForm';
import ReservaDetalhes from '../../../components/reservas/ReservaDetalhes';
import useReserva from '../../../hooks/useReserva';
import useLaboratorio from '../../../hooks/useLaboratorio';
import useTurma from '../../../hooks/useTurmas';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getUserProfile } from '../../../lib/api';

export default function ReservasPage() {
  const [view, setView] = useState('list');
  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const {
    reservas,
    reserva,
    loading,
    error,
    listarReservas,
    obterReservaPorId,
    criarReserva,
    aprovarReserva,
    rejeitarReserva
  } = useReserva();

  const { laboratorios, carregarLaboratorios } = useLaboratorio();
  const { turmas, listarTurmas } = useTurma();

  const funcaoToNumber = {
    'CoordenadorLaboratorio': 2,
    'CoordenadorCurso': 1,
    'Reitoria': 3
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Usuário não autenticado');
        setUserLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(token);
        setUserProfile(profile);

        // Carregar reservas, laboratórios e turmas em paralelo
        await Promise.all([
          listarReservas(),
          carregarLaboratorios(),
          listarTurmas()
        ]);
      } catch (error) {
        toast.error('Erro ao carregar dados iniciais');
        console.error(error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedReservaId && view === 'detail') {
      obterReservaPorId(selectedReservaId);
    }
  }, [selectedReservaId, view]);

  const handleCreate = async (data) => {
    try {
      const reservaData = {
        ...data,
        professorId: userProfile.id
      };
      await criarReserva(reservaData);
      toast.success('Reserva criada com sucesso!');
      setView('list');
      listarReservas();
    } catch (error) {
      toast.error(error.message || 'Falha ao criar reserva');
    }
  };

  const handleApprove = async (id, funcao) => {
    const aprovadorNum = funcaoToNumber[funcao];
    if (aprovadorNum === undefined) {
      toast.error('Função de aprovador inválida');
      return;
    }

    const success = await aprovarReserva(id, aprovadorNum);
    if (success) {
      view === 'detail' ? obterReservaPorId(id) : listarReservas();
    }
  };

  const handleReject = async (id) => {
    const success = await rejeitarReserva(id);
    if (success) {
      view === 'detail' ? obterReservaPorId(id) : listarReservas();
    }
  };

  const filteredReservas = reservas.filter(res => {
  const search = searchTerm.toLowerCase();
  return (
    res.laboratorioNome?.toLowerCase().includes(search) ||
    res.turmaCodigo?.toLowerCase().includes(search) ||
    res.professorNome?.toLowerCase().includes(search)
  );
});

  return (
    <div className="container mx-auto py-8">
      <Card className="border-gray-200 bg-gray-50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-gray-900">
              {view === 'list' && 'Reservas de Laboratórios'}
              {view === 'create' && 'Nova Reserva'}
              {view === 'detail' && 'Detalhes da Reserva'}
            </CardTitle>

            {view === 'list' && (
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar reservas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300"
                  />
                </div>
                <Button
                  className="bg-gray-800 hover:bg-gray-900 text-gray-50"
                  onClick={() => setView('create')}
                  disabled={userLoading}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nova Reserva
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {view === 'list' && (
            <ReservaLista
              reservas={filteredReservas}
              loading={loading}
              onView={(id) => {
                setSelectedReservaId(id);
                setView('detail');
              }}
              onApprove={handleApprove}
              onReject={handleReject}
              userProfile={userProfile}
            />
          )}

          {view === 'create' && (
            <ReservaForm
              onSubmit={handleCreate}
              onCancel={() => setView('list')}
              loading={loading || userLoading}
              laboratorios={laboratorios}
              turmas={turmas}
            />
          )}

          {view === 'detail' && reserva && (
            <ReservaDetalhes
              reserva={reserva}
              onApprove={(funcao) => handleApprove(reserva.id, funcao)}
              onReject={() => handleReject(reserva.id)}
              onBack={() => {
                setView('list');
                setSelectedReservaId(null);
              }}
              userProfile={userProfile}
            />
          )}
        </CardContent>

        {(view === 'create') && (
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setView('list');
                setSelectedReservaId(null);
              }}
            >
              Voltar para lista
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
