"use client";

import type { Prisma } from "@prisma/client";
import { useQueryStates } from "nuqs";
import SortSelect, {
  type SortObject,
  type SortOption,
} from "@/components/sort-select";
import { options as sortOptions, sortParser } from "../search-params";

interface TicketSortSelectProps {
  options: SortOption[];
}

const TicketSortSelect = ({ options }: TicketSortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  const handleChange = (sort: SortObject): void => {
    setSort({
      ...sort,
      sortValue: sort.sortValue as Prisma.SortOrder,
    });
  };

  return (
    <SortSelect options={options} value={sort} onValueChange={handleChange} />
  );
};

export default TicketSortSelect;
