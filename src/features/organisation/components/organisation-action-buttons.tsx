"use client";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
  LucideTrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OrganisationActionButtons = () => (
  <div className="flex justify-end gap-x-2">
    <Button onClick={() => console.log("click")} size="icon" variant="outline">
      <LucideArrowLeftRight className="aspect-square w-4" />
    </Button>
    <Button onClick={() => console.log("click")} size="icon" variant="outline">
      <LucideArrowUpRightFromSquare className="aspect-square w-4" />
    </Button>
    <Button onClick={() => console.log("click")} size="icon" variant="outline">
      <LucidePen className="aspect-square w-4" />
    </Button>
    <Button
      onClick={() => console.log("click")}
      size="icon"
      variant="destructive"
    >
      <LucideTrash className="aspect-square w-4" />
    </Button>
  </div>
);

export { OrganisationActionButtons };
