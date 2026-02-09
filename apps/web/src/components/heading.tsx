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
    <div className="grid h-min w-full grid-cols-[max-content_0.5fr] items-center justify-between gap-x-4 self-start px-4 sm:px-8">
      <div>
        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {actions}
    </div>
    <Separator />
  </>
);

export { Heading };
