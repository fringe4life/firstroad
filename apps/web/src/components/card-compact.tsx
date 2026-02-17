import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CardCompactProps {
  className?: string;
  content: React.ReactNode;
  description: string;
  footer?: React.ReactNode;
  title: string;
}

const CardCompact = ({
  title,
  description,
  content,
  className,
  footer,
}: CardCompactProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{content}</CardContent>
    {Boolean(footer) && <CardFooter>{footer}</CardFooter>}
  </Card>
);

export { CardCompact };
