// src/components/turmas/TurmaDetalhes.jsx
import React from 'react';
import { Button } from '@/components/ui/button';

export default function TurmaDetalhes({ turma, onEdit, onDelete }) {
  if (!turma) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Código</h3>
            <p className="text-lg text-gray-900">{turma.codigo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Disciplina</h3>
            <p className="text-lg text-gray-900">{turma.disciplina}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Horário</h3>
            <p className="text-lg text-gray-900">{turma.horario}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Período Letivo</h3>
            <p className="text-lg text-gray-900">{turma.periodoLetivo}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Curso</h3>
          <p className="text-lg text-gray-900">{turma.curso?.nome || 'N/A'}</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="secondary" 
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          onClick={() => onEdit(turma.id)}
        >
          Editar
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onDelete(turma.id)}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}