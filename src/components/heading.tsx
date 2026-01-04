import { Separator } from "@/components/ui/separator";

interface HeadingProps {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
}
const Heading = ({ title, description, tabs }: HeadingProps) => (
  <>
    {tabs}
    <div className="w-full justify-self-stretch px-8">
      <h2 className="font-bold text-3xl tracking-tight">{title}</h2>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
    <Separator />
  </>
);

export { Heading };
