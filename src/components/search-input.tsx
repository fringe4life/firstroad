"use client";

import { Input } from "./ui/input";

type SearchInputProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const SearchInput = ({
  value = "",
  onChange,
  placeholder,
}: SearchInputProps) => {
  return (
    <Input
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default SearchInput;
