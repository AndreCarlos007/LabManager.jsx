// src/components/reservas/ReservaDetalhes.jsx
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusVariant = {
  Pendente: 'outline',
  Aprovada: 'success',
  Rejeitada: 'destructive',
  'Aguardando Coordenação': 'warning',
  'Aguardando Reitoria': 'warning'
};

export default function ReservaDetalhes({ 
  reserva, 
  onApprove,
  onReject,
  onBack,
  userProfile
}) {
  const canApprove = () => {
    if (!userProfile || !reserva) return false;
    
    if (userProfile.funcao === 'CoordenadorLaboratorio' && reserva.status === 'Pendente') {
      return true;
    }
    
    if (userProfile.funcao === 'CoordenadorCurso' && reserva.status === 'Aguardando Coordenação') {
      return true;
    }
    
    if (userProfile.funcao === 'Reitoria' && reserva.status === 'Aguardando Reitoria') {
      return true;
    }
    
    return false;
  };

  const renderApprovalFlow = () => {
  const steps = [
    { name: 'Coordenador do Laboratório', status: reserva.aprovacaoLaboratorio || 'Pendente' },
    { name: 'Coordenador do Curso', status: reserva.aprovacaoCoordenacao || 'Pendente' },
    { name: 'Pró-Reitoria', status: reserva.aprovacaoReitoria || 'Pendente' }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Fluxo de Aprovação</h3>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
              step.status === 'Aprovada' ? 'bg-green-500' : 
              step.status === 'Rejeitada' ? 'bg-red-500' : 
              'bg-gray-300'
            }`}>
              {step.status === 'Aprovada' ? (
                <Check className="h-4 w-4 text-white" />
              ) : step.status === 'Rejeitada' ? (
                <X className="h-4 w-4 text-white" />
              ) : (
                <Clock className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <span className="text-sm">{step.name}</span>
            <div className="ml-auto">
              <Badge variant={statusVariant[step.status] || 'outline'}>
                {step.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  return (
    <Card className="border-gray-200 bg-gray-50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalhes da Reserva</span>
          <Badge variant={statusVariant[reserva.status] || 'outline'}>
            {reserva.status || 'Pendente'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Laboratório</h3>
            <p className="text-lg font-medium">{reserva.laboratorioNome}</p>
            {reserva.laboratorioLocalizacao && (
              <p className="text-sm text-gray-600">{reserva.laboratorioLocalizacao}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Turma</h3>
            {/* Assumindo que reserva.turma tem a estrutura da turma */}
            <p className="text-lg font-medium">{reserva.turmaCodigo}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Professor</h3>
            <p className="text-lg font-medium">{reserva.professorNome}</p>
            {reserva.professorEmail && (
              <p className="text-sm text-gray-600">{reserva.professorEmail}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Início</h3>
            <p className="text-lg font-medium">
              {reserva.dataHoraInicio ? 
                format(new Date(reserva.dataHoraInicio), "dd/MM/yyyy", { locale: ptBR }) : 
                ''}
            </p>
            {reserva.dataHoraInicio && (
              <p className="text-sm text-gray-600">
                {format(new Date(reserva.dataHoraInicio), "HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fim</h3>
            <p className="text-lg font-medium">
              {reserva.dataHoraFim ? 
                format(new Date(reserva.dataHoraFim), "dd/MM/yyyy", { locale: ptBR }) : 
                ''}
            </p>
            {reserva.dataHoraFim && (
              <p className="text-sm text-gray-600">
                {format(new Date(reserva.dataHoraFim), "HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
        
        {renderApprovalFlow()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={onBack}
        >
          Voltar
        </Button>
        
        {canApprove() && (
          <div className="space-x-3">
            <Button 
              variant="success"
              onClick={() => onApprove(reserva.id, userProfile.funcao)}
            >
              <Check className="mr-2 h-4 w-4" /> Aprovar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onReject(reserva.id)}
            >
              <X className="mr-2 h-4 w-4" /> Rejeitar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
