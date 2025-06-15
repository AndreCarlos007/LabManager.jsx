"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

export default function LaboratorioForm({ 
  initialData, 
  onSubmit, 
  loading,
  coordenadores
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      nome: '',
      capacidade: '',
      localizacao: '',
      area: '',
      coordenadorId: '',
      descricao: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="nome" className="text-gray-700">Nome do Laboratório</Label>
          <Input
            id="nome"
            {...register('nome', { required: 'Nome é obrigatório' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: Lab de Informática 01"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        <div>
          <Label htmlFor="capacidade" className="text-gray-700">Capacidade</Label>
          <Input
            id="capacidade"
            type="number"
            {...register('capacidade', { 
              required: 'Capacidade é obrigatória',
              min: { value: 1, message: 'Capacidade mínima é 1' }
            })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: 30"
          />
          {errors.capacidade && <p className="text-red-500 text-sm mt-1">{errors.capacidade.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="localizacao" className="text-gray-700">Localização</Label>
          <Input
            id="localizacao"
            {...register('localizacao', { required: 'Localização é obrigatória' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: Bloco A, Sala 205"
          />
          {errors.localizacao && <p className="text-red-500 text-sm mt-1">{errors.localizacao.message}</p>}
        </div>

        <div>
          <Label htmlFor="area" className="text-gray-700">Área (m²)</Label>
          <Input
            id="area"
            {...register('area', { required: 'Área é obrigatória' })}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900"
            placeholder="Ex: 120"
          />
          {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="coordenadorId" className="text-gray-700">Coordenador</Label>
          {coordenadores.length > 0 ? (
            <>
              <select
                id="coordenadorId"
                {...register('coordenadorId', { 
                  required: 'Coordenador é obrigatório',
                  setValueAs: v => Number(v)
                })}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {coordenadores.map((coordenador) => (
                  <option key={coordenador.id} value={coordenador.id}>
                    {coordenador.nome}
                  </option>
                ))}
              </select>
              {errors.coordenadorId && <p className="text-red-500 text-sm mt-1">{errors.coordenadorId.message}</p>}
            </>
          ) : (
            <p className="text-gray-500 py-2">
              {loading ? 'Carregando coordenador...' : 'Nenhum coordenador disponível'}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="descricao" className="text-gray-700">Descrição</Label>
          <Textarea
            id="descricao"
            {...register('descricao')}
            disabled={loading}
            className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
            placeholder="Equipamentos e recursos disponíveis..."
          />
        </div>
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
          {loading ? 'Salvando...' : 'Salvar Laboratório'}
        </Button>
      </div>
    </form>
  );
}