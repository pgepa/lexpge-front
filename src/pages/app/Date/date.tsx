"use client";

import { useState, useEffect } from "react";
import { format, parse, setYear, setMonth, getYear, getMonth, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const [selectedYear, setSelectedYear] = useState<number>(date ? getYear(date) : new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(date ? getMonth(date) : new Date().getMonth());
  const [inputValue, setInputValue] = useState<string>(date ? format(date, "dd/MM/yyyy") : "");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(selectedYear, selectedMonth));

  useEffect(() => {
    setCurrentMonth(new Date(selectedYear, selectedMonth));
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    if (date) {
      const updatedDate = setYear(date, year);
      onChange(updatedDate);
    } else {
      onChange(new Date(year, selectedMonth, 1));
    }
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    if (date) {
      const updatedDate = setMonth(date, month);
      onChange(updatedDate);
    } else {
      onChange(new Date(selectedYear, month, 1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parsedDate = parse(value, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) {
      setSelectedYear(getYear(parsedDate));
      setSelectedMonth(getMonth(parsedDate));
      onChange(parsedDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelectedYear(getYear(selectedDate));
      setSelectedMonth(getMonth(selectedDate));
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
    }
    onChange(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-auto justify-start text-left font-normal h-10",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* Campo de entrada para a data */}
        <div className="p-2">
          <Input
            placeholder="dd/mm/aaaa"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {/* Seletor de ano */}
        <div className="p-2">
          <Select onValueChange={(value) => handleYearChange(Number(value))} value={selectedYear.toString()}>
            <SelectTrigger>
              <SelectValue>{selectedYear}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Seletor de mês */}
        <div className="p-2">
          <Select onValueChange={(value) => handleMonthChange(Number(value))} value={selectedMonth.toString()}>
            <SelectTrigger>
              <SelectValue>{format(new Date(selectedYear, selectedMonth), "MMMM", { locale: ptBR })}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(selectedYear, i), "MMMM", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calendário */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          locale={ptBR}
          defaultMonth={currentMonth} // Usa o estado `currentMonth` atualizado
        />
      </PopoverContent>
    </Popover>
  );
}
