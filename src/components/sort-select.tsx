"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface SortOption {
	label: string;
	sortKey: string;
	sortValue: string;
}

export type SortObject = Omit<SortOption, "label">;
interface SortSelectProps {
	options: SortOption[];
	value: SortObject;
	onValueChange: (sort: SortObject) => void;
	placeholder?: string;
}

const SortSelect = ({ options, value, onValueChange, placeholder = "Sort by" }: SortSelectProps) => {

	const handleSortChange = (compositeKey: string) => {
		const [sortKey, sortValue] = compositeKey.split("_");
		onValueChange({ sortKey, sortValue });
	};

	return (
		<Select value={`${value.sortKey}_${value.sortValue}`} onValueChange={handleSortChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
						{options.map((option) => (
							<SelectItem key={`${option.sortKey}_${option.sortValue}`} value={`${option.sortKey}_${option.sortValue}`}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default SortSelect;
