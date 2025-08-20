'use client'

import type { ChangeEvent } from "react"
import { Input } from "./ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"


const SearchInput = (props: React.ComponentProps<typeof Input>) => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter()
    const handleChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;

        const params = new URLSearchParams(searchParams)

        if(value){
            params.set('search', value)
        } else {
            params.delete('search')
        }
        router.replace(`${pathName}?${params.toString()}`, {
            scroll: false
        })
    }, 250)

    return <Input onChange={handleChange} {...props} />
}

export default SearchInput;