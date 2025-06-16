// src/components/reservas/ReservaLista.jsx
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Check, X, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusMap = {
  0: 'Pendente',
  1: 'Aprovada',
  2: 'Rejeitada',
  3: 'Aguardando Coordenação',
  4: 'Aguardando Reitoria'
};

const statusVariant = {
  Pendente: 'outline',
  Aprovada: 'success',
  Rejeitada: 'destructive',
  'Aguardando Coordenação': 'warning',
  'Aguardando Reitoria': 'warning'
};

export default function ReservaLista({ 
  reservas, 
  loading, 
  onView, 
  onApprove,
  onReject,
  userProfile
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-700">Carregando reservas...</span>
      </div>
    );
  }

  if (!reservas || reservas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma reserva encontrada</h3>
        <p className="text-sm text-gray-500">Crie uma nova reserva para começar</p>
      </div>
    );
  }

  const canApprove = (reserva) => {
    if (!userProfile) return false;
    const statusText = statusMap[reserva.status] || 'Pendente';

    if (userProfile.funcao === 'CoordenadorLaboratorio' && statusText === 'Pendente') {
      return true;
    }
    if (userProfile.funcao === 'CoordenadorCurso' && statusText === 'Aguardando Coordenação') {
      return true;
    }
    if (userProfile.funcao === 'Reitoria' && statusText === 'Aguardando Reitoria') {
      return true;
    }
    return false;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Laboratório</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {reservas.map((reserva) => {
            const statusText = statusMap[reserva.status] || 'Pendente';
            return (
              <TableRow key={reserva.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {reserva.laboratorioNome || 'N/A'}
                </TableCell>
                <TableCell>{reserva.turmaCodigo || 'N/A'}</TableCell>
                <TableCell>
                  {reserva.dataHoraInicio ? 
                    format(new Date(reserva.dataHoraInicio), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 
                    'N/A'}
                </TableCell>
                <TableCell>
                  {reserva.dataHoraFim ? 
                    format(new Date(reserva.dataHoraFim), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 
                    'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[statusText] || 'outline'}>
                    {statusText}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onView(reserva.id)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {canApprove(reserva) && (
                      <>
                        <Button 
                          variant="success" 
                          size="icon"
                          onClick={() => onApprove(reserva.id, userProfile.funcao)}
                          title="Aprovar reserva"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => onReject(reserva.id)}
                          title="Rejeitar reserva"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
