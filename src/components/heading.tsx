import { Separator } from "@/components/ui/separator";

type HeadingProps = {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
};
const Heading = ({ title, description, tabs }: HeadingProps) => (
  <>
    {tabs}
    <div className="px-8">
      <h2 className="font-bold text-3xl tracking-tight">{title}</h2>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
    <Separator />
  </>
);

export default Heading;
