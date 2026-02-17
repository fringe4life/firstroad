"use client";

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
}: SearchInputProps) => (
  <Input
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    value={value}
  />
);

export { SearchInput };
