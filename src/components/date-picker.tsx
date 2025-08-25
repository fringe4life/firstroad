"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useImperativeHandle, useState } from "react";
import type { SelectSingleEventHandler } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DateReset = {
  reset: () => void;
};

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string;
  ref: React.RefObject<DateReset | null>;
};

const DatePicker = ({ id, name, defaultValue, ref }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date(),
  );
  const [open, setOpen] = useState<boolean>(false);
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  useImperativeHandle(ref, () => ({
    reset: () => setDate(new Date()),
  }));

  const handleSelect: SelectSingleEventHandler = (
    _date: Date | undefined,
    selectedDay: Date,
  ) => {
    setDate(selectedDay);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger id={id} asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon />
          {formattedDate}
          <input type="hidden" value={formattedDate} name={name} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
