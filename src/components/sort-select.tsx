"use client";

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

export type SortObject = Omit<SortOption, "label">;
interface SortSelectProps {
  options: SortOption[];
  value: SortObject;
  onValueChange: (sort: SortObject) => void;
}

function createKey(option: SortOption | SortObject) {
  return `${option.sortKey}_${option.sortValue}`;
}

const SortSelect = ({ options, value, onValueChange }: SortSelectProps) => {
  const handleSortChange = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    onValueChange({ sortKey, sortValue });
  };

  return (
    <Select value={createKey(value)} onValueChange={handleSortChange}>
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

export default SortSelect;
