"use client";

import { startTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export interface SortOption {
  label: string;
  sortKey: string;
  sortValue: string;
}

export interface SortObject extends Omit<SortOption, "label"> {}
interface SortSelectProps {
  options: readonly SortOption[];
  value: SortObject;
  onValueChange: (sort: SortObject) => void;
}

const createKey = (option: SortOption | SortObject) =>
  `${option.sortKey}_${option.sortValue}`;

const SortSelect = ({ options, value, onValueChange }: SortSelectProps) => {
  const handleSortChange = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    startTransition(() => {
      onValueChange({ sortKey, sortValue });
    });
  };

  return (
    <Select onValueChange={handleSortChange} value={createKey(value)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={createKey(option)} value={createKey(option)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { SortSelect };
