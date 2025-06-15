// src/app/turmas/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus } from 'lucide-react';
import TurmaLista from '../../../components/turmas/TurmaLista';
import TurmaForm from '../../../components/turmas/TurmaForms';
import TurmaDetalhes from '../../../components/turmas/TurmaDetalhes';
import useTurmas from '../../../hooks/useTurmas';
import { toast } from 'sonner';

export default function TurmasPage() {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'detail'
  const [selectedTurmaId, setSelectedTurmaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    turmas, 
    turma, 
    loading, 
    error,
    carregarTurmas,
    carregarTurmaPorId,
    adicionarTurma,
    editarTurma,
    removerTurma
  } = useTurmas();

  // Dados fictícios de cursos (substituir por chamada à API se necessário)
  const cursos = [
    { id: 1, nome: 'Ciência da Computação' },
    { id: 2, nome: 'Engenharia de Software' },
    { id: 3, nome: 'Medicina' },
  ];

  useEffect(() => {
    carregarTurmas();
  }, []);

  useEffect(() => {
    if (selectedTurmaId && (view === 'detail' || view === 'edit')) {
      carregarTurmaPorId(selectedTurmaId);
    }
  }, [selectedTurmaId, view]);

  const handleCreate = async (data) => {
    try {
      // Converter cursoId para número
      const turmaData = {
        ...data,
        cursoId: Number(data.cursoId)
      };
      await adicionarTurma(turmaData);
      toast.success('Turma criada com sucesso!');
      setView('list');
    } catch (error) {
      toast.error(error.message || 'Falha ao criar turma');
    }
  };

  const handleEdit = async (data) => {
    try {
      // Converter cursoId para número
      const turmaData = {
        ...data,
        cursoId: Number(data.cursoId)
      };
      await editarTurma(selectedTurmaId, turmaData);
      toast.success('Turma atualizada com sucesso!');
      setView('detail');
    } catch (error) {
      toast.error(error.message || 'Falha ao atualizar turma');
    }
  };

  const handleDelete = async (id) => {
    
    
    try {
      await removerTurma(id);
      toast.success('Turma excluída com sucesso!');
      setView('list');
    } catch (error) {
      toast.error(error.message || 'Falha ao excluir turma');
    }
  };

  const filteredTurmas = turmas.filter(t => 
    t.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.horario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.periodoLetivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 w-[70rem] ml-2">
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-gray-900">
              {view === 'list' && 'Turmas'}
              {view === 'create' && 'Nova Turma'}
              {view === 'edit' && 'Editar Turma'}
              {view === 'detail' && 'Detalhes da Turma'}
            </CardTitle>
            
            {view === 'list' && (
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Input
                  placeholder="Buscar turmas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md bg-white border-gray-300"
                />
                <Button 
                  className="bg-gray-800 hover:bg-gray-900 text-gray-50"
                  onClick={() => setView('create')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nova Turma
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {view === 'list' && (
            <TurmaLista 
              turmas={filteredTurmas} 
              loading={loading} 
              onView={(id) => {
                setSelectedTurmaId(id);
                setView('detail');
              }}
              onEdit={(id) => {
                setSelectedTurmaId(id);
                setView('edit');
              }}
              onDelete={handleDelete}
            />
          )}
          
          {view === 'create' && (
            <TurmaForm 
              onSubmit={handleCreate} 
              loading={loading}
              cursos={cursos}
            />
          )}
          
          {view === 'edit' && turma && (
            <TurmaForm 
              initialData={turma}
              onSubmit={handleEdit} 
              loading={loading}
              cursos={cursos}
            />
          )}
          
          {view === 'detail' && turma && (
            <TurmaDetalhes 
              turma={turma} 
              onEdit={() => setView('edit')}
              onDelete={handleDelete}
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
                setSelectedTurmaId(null);
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