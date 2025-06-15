
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash } from 'lucide-react';

export default function TurmaLista({ 
  turmas, 
  loading, 
  onView, 
  onEdit, 
  onDelete 
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!turmas || turmas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma turma encontrada</p>
      </div>
    );
  }

  return (
    <Table className="border border-gray-200 rounded-lg">
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="text-gray-700">Código</TableHead>
          <TableHead className="text-gray-700">Disciplina</TableHead>
          <TableHead className="text-gray-700">Horário</TableHead>
          <TableHead className="text-gray-700">Período Letivo</TableHead>
          <TableHead className="text-gray-700">Curso</TableHead>
          <TableHead className="text-gray-700">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {turmas.map((turma) => (
          <TableRow key={turma.id} className="hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">{turma.codigo}</TableCell>
            <TableCell className="text-gray-700">{turma.disciplina}</TableCell>
            <TableCell className="text-gray-700">{turma.horario}</TableCell>
            <TableCell className="text-gray-700">{turma.periodoLetivo}</TableCell>
            <TableCell className="text-gray-700">{turma.curso?.nome || 'N/A'}</TableCell>
            <TableCell className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => onView(turma.id)}
              >
                <Eye className="h-4 w-4 mr-1" /> Ver
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => onEdit(turma.id)}
              >
                <Pencil className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(turma.id)}
              >
                <Trash className="h-4 w-4 mr-1" /> Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}