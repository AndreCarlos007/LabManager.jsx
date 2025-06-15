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
import LaboratorioLista from '../../../components/laboratorios/LaboratorioLista';
import LaboratorioForm from '../../../components/laboratorios/LaboratorioForm';
import LaboratorioDetalhes from '../../../components/laboratorios/LaboratorioDetalhes';
import useLaboratorios from '../../../hooks/useLaboratorio';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getUserProfile } from '../../../lib/api';

export default function LaboratoriosPage() {
  const [view, setView] = useState('list');
  const [selectedLaboratorioId, setSelectedLaboratorioId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [coordenadores, setCoordenadores] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  
  const { 
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
  } = useLaboratorios();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Usuário não autenticado');
        setUserLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(token);
        setCoordenadores([
          { 
            id: profile.id, 
            nome: `Coordenador ${profile.nome}` 
          }
        ]);
      } catch (error) {
        toast.error('Falha ao carregar perfil do coordenador');
        console.error(error);
      } finally {
        setUserLoading(false);
      }
    };

    carregarLaboratorios();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (selectedLaboratorioId && (view === 'detail' || view === 'edit')) {
      carregarLaboratorioPorId(selectedLaboratorioId);
    }
  }, [selectedLaboratorioId, view]);

  const handleCreate = async (data) => {
    try {
      const labData = {
        ...data,
        capacidade: Number(data.capacidade),
        coordenadorId: Number(data.coordenadorId)
      };
      await adicionarLaboratorio(labData);
      toast.success('Laboratório criado com sucesso!');
      setView('list');
    } catch (error) {
      toast.error(error.message || 'Falha ao criar laboratório');
    }
  };

  const handleEdit = async (data) => {
    try {
      const labData = {
        ...data,
        capacidade: Number(data.capacidade),
        coordenadorId: Number(data.coordenadorId)
      };
      await editarLaboratorio(selectedLaboratorioId, labData);
      toast.success('Laboratório atualizado com sucesso!');
      setView('detail');
    } catch (error) {
      toast.error(error.message || 'Falha ao atualizar laboratório');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este laboratório?')) return;
    
    try {
      await removerLaboratorio(id);
      toast.success('Laboratório excluído com sucesso!');
      setView('list');
    } catch (error) {
      toast.error(error.message || 'Falha ao excluir laboratório');
    }
  };

  const handleToggleManutencao = async (id, status) => {
    try {
      await toggleManutencao(id, status);
      toast.success(`Laboratório ${status ? 'em manutenção' : 'disponível'}!`);
    } catch (error) {
      toast.error(error.message || 'Falha ao atualizar status');
    }
  };

  const filteredLaboratorios = laboratorios.filter(lab => 
    lab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 ml-2 w-[70rem]">
      <Card className="border-gray-200 bg-gray-50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-gray-900">
              {view === 'list' && 'Laboratórios'}
              {view === 'create' && 'Novo Laboratório'}
              {view === 'edit' && 'Editar Laboratório'}
              {view === 'detail' && 'Detalhes do Laboratório'}
            </CardTitle>
            
            {view === 'list' && (
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar laboratórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300"
                  />
                </div>
                <Button 
                  className="bg-gray-800 hover:bg-gray-900 text-gray-50"
                  onClick={() => setView('create')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Novo Laboratório
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {view === 'list' && (
            <LaboratorioLista 
              laboratorios={filteredLaboratorios} 
              loading={loading} 
              onView={(id) => {
                setSelectedLaboratorioId(id);
                setView('detail');
              }}
              onEdit={(id) => {
                setSelectedLaboratorioId(id);
                setView('edit');
              }}
              onDelete={handleDelete}
              onToggleManutencao={handleToggleManutencao}
            />
          )}
          
          {view === 'create' && (
            <LaboratorioForm 
              onSubmit={handleCreate} 
              loading={loading || userLoading}
              coordenadores={coordenadores}
            />
          )}
          
          {view === 'edit' && laboratorio && (
            <LaboratorioForm 
              initialData={laboratorio}
              onSubmit={handleEdit} 
              loading={loading || userLoading}
              coordenadores={coordenadores}
            />
          )}
          
          {view === 'detail' && laboratorio && (
            <LaboratorioDetalhes 
              laboratorio={laboratorio} 
              onEdit={() => setView('edit')}
              onDelete={handleDelete}
              onToggleManutencao={handleToggleManutencao}
            />
          )}
        </CardContent>
        
        {(view !== 'list') && (
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setView('list');
                setSelectedLaboratorioId(null);
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