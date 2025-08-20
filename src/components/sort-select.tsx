"use client";

import { useQueryState } from "nuqs";
import { useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface Option {
	label: string;
	value: string;
}

interface SortSelectProps {
	options: Option[];
	defaultValue: string;
}

const SortSelect = ({ options, defaultValue }: SortSelectProps) => {
	const [isPending, startTransition] = useTransition();
	const [sort, setSort] = useQueryState("sort", {
		defaultValue,
		clearOnDefault: false,
		shallow: false,
		startTransition,
	});

	const handleChange = (value: string): void => {
		setSort(value === defaultValue ? null : value);
	};

	return (
		<Select
			value={sort || defaultValue}
			onValueChange={handleChange}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default SortSelect;
