"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { MouseEventHandler } from "react";
import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_LIMIT,
  LIMITS,
  type LimitItem,
  type PaginationType,
} from "@/features/pagination/pagination-search-params";
import type { PaginationMetadata } from "@/features/pagination/types";

type PaginationProps = {
  pagination: PaginationType;
  setPagination: (pagination: PaginationType) => void;
  metadata: PaginationMetadata;
};
const Pagination = ({
  pagination,
  setPagination,
  metadata,
}: PaginationProps) => {
  const { page, limit } = pagination;
  const startOffset = page * limit + 1;
  const endOffset = startOffset - 1 + limit;
  const actualEndOffset = Math.min(endOffset, metadata.count);

  const label = `${startOffset} - ${actualEndOffset} of ${metadata.count}`;

  const handleNextPage: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(() => {
      setPagination({
        ...pagination,
        page: page + 1,
      });
    });
  };

  const handlePreviousPage: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(() => {
      setPagination({
        ...pagination,
        page: page - 1,
      });
    });
  };

  const handleLimitChange = (value: string) => {
    const valueAsLimit: LimitItem =
      LIMITS.find((l) => l.toString() === value) ?? DEFAULT_LIMIT;
    startTransition(() => {
      setPagination({
        ...pagination,
        limit: valueAsLimit,
        page: 0,
      });
    });
  };

  const nextButton = (
    <Button
      disabled={!metadata.hasNextPage}
      onClick={handleNextPage}
      size="sm"
      variant="outline"
    >
      <ChevronRightIcon />
    </Button>
  );

  const previousButton = (
    <Button
      disabled={page < 1}
      onClick={handlePreviousPage}
      size="sm"
      variant="outline"
    >
      <ChevronLeftIcon />
    </Button>
  );

  const limitDropdown = (
    <Select defaultValue={limit.toString()} onValueChange={handleLimitChange}>
      <SelectTrigger className="h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="flex items-center gap-x-2">
        {limitDropdown}
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};

export default Pagination;
