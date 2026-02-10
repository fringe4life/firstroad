"use client";

import { LucideArrowUpDown } from "lucide-react";
import { startTransition } from "react";
import { ResponsiveLabel } from "@/components/responsive-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
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

  const activeOption =
    options.find(
      (option) =>
        option.sortKey === value.sortKey &&
        option.sortValue === value.sortValue,
    ) ?? options[0];

  return (
    <Select onValueChange={handleSortChange} value={createKey(value)}>
      <ResponsiveLabel
        fullLabel={activeOption?.label ?? ""}
        icon={<LucideArrowUpDown className="aspect-square w-4" />}
        shortLabel="Sort"
      >
        <SelectTrigger className="w-full" />
      </ResponsiveLabel>
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
