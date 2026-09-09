"use client";

import type { ChangeEventHandler } from "react";
import { Input } from "./ui/input";

interface SearchInputProps {
  onChange: (value: string) => void;
  placeholder: string;
  value?: string;
}

const SearchInput = ({
  value = "",
  onChange,
  placeholder,
}: SearchInputProps) => {
  const handleSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };
  return (
    <Input onChange={handleSearch} placeholder={placeholder} value={value} />
  );
};

export { SearchInput };
