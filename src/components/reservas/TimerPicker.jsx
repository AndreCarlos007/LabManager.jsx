import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function TimePicker({ date, setDate }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleHourChange = (hour) => {
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour));
    setDate(newDate);
  };

  const handleMinuteChange = (minute) => {
    const newDate = new Date(date);
    newDate.setMinutes(parseInt(minute));
    setDate(newDate);
  };

  return (
    <div className="flex space-x-2">
      <Select value={date.getHours().toString()} onValueChange={handleHourChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Hora" />
        </SelectTrigger>
        <SelectContent>
          {hours.map(hour => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour.toString().padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={date.getMinutes().toString()} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Minuto" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map(minute => (
            <SelectItem key={minute} value={minute.toString()}>
              {minute.toString().padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}