import { Separator } from "@radix-ui/react-separator";

type HeadingProps = {
  title: string;
  description?: string;
};
const Heading = ({ title, description }: HeadingProps) => {
  return (
    <>
      <div className="px-8">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Separator className="h-[.5px] bg-slate-200" />
    </>
  );
};

export default Heading;
