'use client'

import type { ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

interface Option {
    label: string;
    value: string;
}

interface SortSelectProps {
    options: Option[];
    defaultValue: string;
}

const SortSelect = ({ options, defaultValue }: SortSelectProps) => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter()
    const handleChange = (value: string): void => {
        const params = new URLSearchParams(searchParams)

        if(value !== defaultValue){
            params.set('sort', value)
        } else {
            params.delete('sort')
        }
        router.replace(`${pathName}?${params.toString()}`, {
            scroll: false
        })
    }

    return  <Select defaultValue={searchParams.get('sort')?.toString() ?? defaultValue} onValueChange={handleChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent >
      <SelectGroup>
        {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
}

export default SortSelect;