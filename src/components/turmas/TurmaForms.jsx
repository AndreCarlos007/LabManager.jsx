// src/components/turmas/TurmaForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TurmaForm({ 
  initialData, 
  onSubmit, 
  loading,
  cursos
}) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      codigo: '',
      disciplina: '',
      horario: '',
      periodoLetivo: '',
      cursoId: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="codigo" className="text-gray-700">Código</Label>
          <Input
            id="codigo"
            {...register('codigo', { required: 'Código é obrigatório' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: TURMA-001"
          />
          {errors.codigo && <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>}
        </div>

        <div>
          <Label htmlFor="disciplina" className="text-gray-700">Disciplina</Label>
          <Input
            id="disciplina"
            {...register('disciplina', { required: 'Disciplina é obrigatória' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: Programação Web"
          />
          {errors.disciplina && <p className="text-red-500 text-sm mt-1">{errors.disciplina.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="horario" className="text-gray-700">Horário</Label>
          <Input
            id="horario"
            {...register('horario', { required: 'Horário é obrigatório' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: Segunda 14:00-16:00"
          />
          {errors.horario && <p className="text-red-500 text-sm mt-1">{errors.horario.message}</p>}
        </div>

        <div>
          <Label htmlFor="periodoLetivo" className="text-gray-700">Período Letivo</Label>
          <Input
            id="periodoLetivo"
            {...register('periodoLetivo', { required: 'Período letivo é obrigatório' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: 2023.2"
          />
          {errors.periodoLetivo && <p className="text-red-500 text-sm mt-1">{errors.periodoLetivo.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="cursoId" className="text-gray-700">Curso</Label>
        <Select
          value={watch('cursoId')}
          onValueChange={(value) => setValue('cursoId', value)}
          disabled={loading}
        >
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {cursos.map((curso) => (
              <SelectItem 
                key={curso.id} 
                value={curso.id.toString()}
                className="text-gray-700 hover:bg-gray-100"
              >
                {curso.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cursoId && <p className="text-red-500 text-sm mt-1">Curso é obrigatório</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-gray-800 hover:bg-gray-900 text-gray-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Turma'}
        </Button>
      </div>
    </form>
  );
}