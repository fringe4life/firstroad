import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CardCompactProps {
  title: string;
  description: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
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
