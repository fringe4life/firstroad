import { Separator } from "@/components/ui/separator";

interface HeadingProps {
  title: string;
  description: string;
  tabs?: React.ReactNode;
  actions?: React.ReactNode;
}
const Heading = ({ title, description, tabs, actions }: HeadingProps) => (
  <>
    {tabs}
    <div
      className="grid h-min w-full grid-cols-1 items-center justify-between gap-x-4 self-start px-4 data-[item='true']:grid-cols-[max-content_0.5fr] sm:px-8"
      data-item={Boolean(actions)}
    >
      <div>
        <h2 className="font-bold text-xl xs:text-2xl tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {description}
        </p>
      </div>
      {actions}
    </div>
    <Separator />
  </>
);

export { Heading };
