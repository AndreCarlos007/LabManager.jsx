"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar, Loader } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarUI } from '../ui/calendar';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ReservaForm({ 
  initialData, 
  onSubmit, 
  loading,
  laboratorios = [],
  turmas = []
}) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const [dateError, setDateError] = useState('');

  // Função para converter para Date mantendo o fuso local
  const getInitialDate = (dateString) => {
    return dateString ? new Date(dateString) : new Date();
  };

  // Função para formatar no padrão da API (ISO sem UTC)
  const formatToAPI = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  // Valores iniciais formatados corretamente
  const initialValues = initialData || {
    laboratorioId: '',
    turmaId: '',
    dataHoraInicio: formatToAPI(new Date()),
    dataHoraFim: formatToAPI(new Date(new Date().setHours(new Date().getHours() + 1)))
  };

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch
  } = useForm({
    defaultValues: initialValues
  });

  const [startDate, setStartDate] = useState(getInitialDate(initialValues.dataHoraInicio));
  const [endDate, setEndDate] = useState(getInitialDate(initialValues.dataHoraFim));
  const [startTime, setStartTime] = useState({
    hours: getInitialDate(initialValues.dataHoraInicio).getHours(),
    minutes: getInitialDate(initialValues.dataHoraInicio).getMinutes()
  });
  const [endTime, setEndTime] = useState({
    hours: getInitialDate(initialValues.dataHoraFim).getHours(),
    minutes: getInitialDate(initialValues.dataHoraFim).getMinutes()
  });

  // Combina data e hora para um objeto Date
  const combineDateTime = (datePart, timePart) => {
    const combined = new Date(datePart);
    combined.setHours(timePart.hours, timePart.minutes, 0, 0);
    return combined;
  };

  // Atualiza os valores do formulário quando os estados de data/hora mudam
  useEffect(() => {
    const startCombined = combineDateTime(startDate, startTime);
    const endCombined = combineDateTime(endDate, endTime);

    // Validação de datas
    if (startCombined >= endCombined) {
      setDateError('A data de término deve ser posterior à data de início');
    } else {
      setDateError('');
    }

    // Atualiza os valores no formulário com o formato correto
    setValue('dataHoraInicio', formatToAPI(startCombined));
    setValue('dataHoraFim', formatToAPI(endCombined));
    
  }, [startDate, startTime, endDate, endTime, setValue]);

  // Função para lidar com o envio do formulário
  const handleFormSubmit = async (data) => {
    // Verifica se há erro de data
    const start = new Date(data.dataHoraInicio);
    const end = new Date(data.dataHoraFim);
    
    if (start >= end) {
      setDateError('A data de término deve ser posterior à data de início');
      return;
    }

    // Limpa o erro se estiver tudo certo
    setDateError('');

    // Chama a função onSubmit passada pelo componente pai
    try {
      await onSubmit(data);
    } catch (error) {
      setFormError(error.message || 'Ocorreu um erro ao salvar a reserva');
    }
  };

  // Atualiza hora/minuto do estado conforme selects
  const handleTimeChange = (value, target, unit) => {
    if (target === 'start') {
      setStartTime(prev => ({ ...prev, [unit]: parseInt(value) }));
    } else {
      setEndTime(prev => ({ ...prev, [unit]: parseInt(value) }));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {formError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {formError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="laboratorioId" className="text-gray-700">Laboratório</Label>
          {laboratorios.length > 0 ? (
            <select
              id="laboratorioId"
              {...register('laboratorioId', { 
                required: 'Laboratório é obrigatório',
                setValueAs: v => Number(v)
              })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Selecione um laboratório</option>
              {laboratorios.map(lab => (
                <option key={lab.id} value={lab.id}>
                  {lab.nome} - {lab.localizacao}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 py-2">{loading ? 'Carregando laboratórios...' : 'Nenhum laboratório disponível'}</p>
          )}
          {errors.laboratorioId && <p className="text-red-500 text-sm mt-1">{errors.laboratorioId.message}</p>}
        </div>

        <div>
          <Label htmlFor="turmaId" className="text-gray-700">Turma</Label>
          {turmas.length > 0 ? (
            <select
              id="turmaId"
              {...register('turmaId', { 
                required: 'Turma é obrigatória',
                setValueAs: v => Number(v)
              })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Selecione uma turma</option>
              {turmas.map(turma => (
                <option key={turma.id} value={turma.id}>
                  {turma.disciplina} ({turma.codigo})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 py-2">{loading ? 'Carregando turmas...' : 'Nenhuma turma disponível'}</p>
          )}
          {errors.turmaId && <p className="text-red-500 text-sm mt-1">{errors.turmaId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-700">Data e Hora de Início</Label>
          <div className="flex flex-col space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarUI
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            <div className="flex space-x-2">
              <Select
                value={startTime.hours.toString()}
                onValueChange={(value) => handleTimeChange(value, 'start', 'hours')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hora" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={startTime.minutes.toString()}
                onValueChange={(value) => handleTimeChange(value, 'start', 'minutes')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Minuto" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 15, 30, 45].map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-gray-700">Data e Hora de Fim</Label>
          <div className="flex flex-col space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarUI
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            <div className="flex space-x-2">
              <Select
                value={endTime.hours.toString()}
                onValueChange={(value) => handleTimeChange(value, 'end', 'hours')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hora" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={endTime.minutes.toString()}
                onValueChange={(value) => handleTimeChange(value, 'end', 'minutes')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Minuto" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 15, 30, 45].map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {dateError && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
          {dateError}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-gray-800 hover:bg-gray-900 text-gray-50"
          disabled={loading || dateError}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : 'Salvar Reserva'}
        </Button>
      </div>
    </form>
  );
}