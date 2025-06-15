
import React from 'react';
import { Button } from '../../components/ui/button';
import { 
  Wrench, 
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  LayoutGrid,
  User
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export default function LaboratorioDetalhes({ 
  laboratorio, 
  onEdit, 
  onDelete,
  onToggleManutencao
}) {
  if (!laboratorio) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-full h-64" />
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{laboratorio.nome}</h1>
              <div className="mt-2">
                {laboratorio.emManutencao ? (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    <Wrench className="h-4 w-4 mr-1" /> Em manutenção
                  </Badge>
                ) : (
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" /> Disponível
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              variant={laboratorio.emManutencao ? "default" : "outline"}
              className={laboratorio.emManutencao ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
              onClick={() => onToggleManutencao(laboratorio.id, !laboratorio.emManutencao)}
            >
              {laboratorio.emManutencao ? (
                <><XCircle className="h-4 w-4 mr-2" /> Encerrar Manutenção</>
              ) : (
                <><Wrench className="h-4 w-4 mr-2" /> Iniciar Manutenção</>
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Localização</h3>
                <p className="text-gray-900">{laboratorio.localizacao}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacidade</h3>
                <p className="text-gray-900">{laboratorio.capacidade} pessoas</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <LayoutGrid className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Área</h3>
                <p className="text-gray-900">{laboratorio.area} m²</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Coordenador</h3>
                <p className="text-gray-900">
                  {laboratorio.coordenador?.nome || 'Não atribuído'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {laboratorio.descricao && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
          <p className="text-gray-700 whitespace-pre-line">{laboratorio.descricao}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="secondary" 
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          onClick={() => onEdit(laboratorio.id)}
        >
          Editar
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onDelete(laboratorio.id)}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}