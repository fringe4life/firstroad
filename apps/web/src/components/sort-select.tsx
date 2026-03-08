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
import { createKey } from "@/utils/create-key";
import { isSortOrder } from "@/utils/is-sort-order";
export interface SortOption {
  label: string;
  sortKey: string;
  sortValue: "asc" | "desc";
}

export interface SortObject extends Pick<SortOption, "sortKey" | "sortValue"> {}
interface SortSelectProps {
  onValueChange: (sort: SortObject) => void;
  options: readonly SortOption[];
  value: SortObject;
}

const SortSelect = ({ options, value, onValueChange }: SortSelectProps) => {
  const handleSortChange = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    if (!isSortOrder(sortValue)) {
      return;
    }
    startTransition(() => {
      onValueChange({ sortKey, sortValue });
    });
  };

  const activeOption =
    options.find(
      (option) =>
        option.sortKey === value.sortKey &&
        option.sortValue === value.sortValue,
    ) ??
    options.find((option) => option.sortKey === value.sortKey) ??
    options[0];

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
