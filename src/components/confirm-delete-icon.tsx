import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { Activity } from "react";

type ConfirmDeleteIconProps = {
  isPending: boolean;
};

const ConfirmDeleteIcon = ({ isPending }: ConfirmDeleteIconProps) => (
  <>
    <Activity mode={isPending ? "visible" : "hidden"}>
      <LucideLoaderCircle className="aspect-square w-4 animate-spin" />
    </Activity>
    <Activity mode={isPending ? "hidden" : "visible"}>
      <LucideTrash className="aspect-square w-4" />
    </Activity>
  </>
);

export default ConfirmDeleteIcon;
