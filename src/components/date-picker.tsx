"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useImperativeHandle, useState } from "react";
import type { PropsSingle } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Maybe } from "@/types";

export interface DateReset {
  reset: () => void;
}

interface DatePickerProps {
  id: string;
  name: string;
  defaultValue?: string;
  ref: React.RefObject<Maybe<DateReset>>;
}

const DatePicker = ({ id, name, defaultValue, ref }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(() =>
    defaultValue ? new Date(defaultValue) : new Date(),
  );
  const [open, setOpen] = useState<boolean>(false);
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  useImperativeHandle(ref, () => ({
    reset: () => setDate(new Date()),
  }));

  const handleSelect: PropsSingle["onSelect"] = (selected) => {
    if (selected) {
      setDate(selected);
      setOpen(false);
    }
  };
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild id={id}>
        <Button
          className="w-full justify-start text-left font-normal"
          variant="outline"
        >
          <CalendarIcon />
          {formattedDate}
          <input name={name} type="hidden" value={formattedDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          autoFocus
          mode="single"
          onSelect={handleSelect}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
