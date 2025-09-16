"use client";

import { useQueryStates } from "nuqs";
import SortSelect, {
  type SortObject,
  type SortOption,
} from "@/components/sort-select";
import type { Prisma } from "@/generated/prisma/client";
import { options as sortOptions, sortParser } from "../search-params";

type TicketSortSelectProps = {
  options: SortOption[];
};

const TicketSortSelect = ({ options }: TicketSortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  const handleChange = (sortArg: SortObject): void => {
    setSort({
      ...sortArg,
      sortValue: sort.sortValue as Prisma.SortOrder,
    });
  };

  return (
    <SortSelect onValueChange={handleChange} options={options} value={sort} />
  );
};

export default TicketSortSelect;
