import { Separator } from "@/components/ui/separator";

type HeadingProps = {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
  className?: string;
};
const Heading = ({
  title,
  description,
  tabs,
  className = "justify-self-stretch ",
}: HeadingProps) => (
  <div className={className}>
    {tabs}
    <div className="w-fit px-8 transition-transform duration-200 group-has-[.sidebar:hover]/sidebar-parent:translate-x-[calc(var(--sidebar-current-width)-var(--side-width))]">
      <h2 className="font-bold text-3xl tracking-tight">{title}</h2>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
    <Separator className="transition-transform duration-200 group-has-[.sidebar:hover]/sidebar-parent:translate-x-[calc(var(--sidebar-current-width)-var(--side-width))]" />
  </div>
);

export default Heading;
