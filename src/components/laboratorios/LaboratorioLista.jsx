
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { 
  Eye, 
  Pencil, 
  Trash, 
  Wrench, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export default function LaboratorioLista({ 
  laboratorios, 
  loading, 
  onView, 
  onEdit, 
  onDelete,
  onToggleManutencao
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

  if (!laboratorios || laboratorios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum laboratório encontrado</p>
      </div>
    );
  }

  return (
    <Table className="border border-gray-200 rounded-lg">
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="text-gray-700">Nome</TableHead>
          <TableHead className="text-gray-700">Localização</TableHead>
          <TableHead className="text-gray-700">Capacidade</TableHead>
          <TableHead className="text-gray-700">Área</TableHead>
          <TableHead className="text-gray-700">Status</TableHead>
          <TableHead className="text-gray-700 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {laboratorios.map((lab) => (
          <TableRow key={lab.id} className="hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">{lab.nome}</TableCell>
            <TableCell className="text-gray-700">{lab.localizacao}</TableCell>
            <TableCell className="text-gray-700">{lab.capacidade} pessoas</TableCell>
            <TableCell className="text-gray-700">{lab.area}</TableCell>
            <TableCell>
              {lab.emManutencao ? (
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  <Wrench className="h-4 w-4 mr-1" /> Em manutenção
                </Badge>
              ) : (
                <Badge variant="success" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" /> Disponível
                </Badge>
              )}
            </TableCell>
            <TableCell className="flex justify-end space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => onView(lab.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => onEdit(lab.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={lab.emManutencao ? "default" : "outline"}
                className={lab.emManutencao ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                onClick={() => onToggleManutencao(lab.id, !lab.emManutencao)}
              >
                <Wrench className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(lab.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}