import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLabelProps {
  /**
   * Single element (e.g. Link or Button) that will receive @container/label and
   * render the responsive icon/short/full spans as its children.
   */
  children: ReactElement<{ className?: string; children?: ReactNode }>;
  icon: ReactNode;
  /**
   * Short label for medium width (e.g. "Create").
   */
  shortLabel: string;
  /**
   * Full label for large width (e.g. "Create Organisation").
   */
  fullLabel: string;
}

const ResponsiveLabel = ({
  children,
  icon,
  shortLabel,
  fullLabel,
}: ResponsiveLabelProps) => {
  if (!isValidElement(children)) {
    return null;
  }

  const labelContent = (
    <>
      {/* Small: icon only */}
      <span className="@max-medium/label:inline-flex hidden items-center">
        {icon}
      </span>
      {/* Medium: icon + short label */}
      <span className="@medium:@max-large/label:inline-flex hidden items-center justify-center gap-x-2">
        {icon}
        <span>{shortLabel}</span>
      </span>
      {/* Large: icon + full label */}
      <span className="@large/label:inline-flex hidden items-center justify-center gap-x-2">
        {icon}
        <span>{fullLabel}</span>
      </span>
    </>
  );

  const child = children;
  return cloneElement(child, {
    ...child.props,
    className: cn(child.props.className, "@container/label"),
    children: labelContent,
  });
};

export { ResponsiveLabel };
