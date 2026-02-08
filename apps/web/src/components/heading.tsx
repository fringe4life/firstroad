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
    <div className="flex h-min w-full items-center justify-between self-start px-4 sm:px-8">
      <div className="w-full justify-self-stretch">
        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="flex items-center gap-x-2"> {actions}</div>
    </div>
    <Separator />
  </>
);

export { Heading };
