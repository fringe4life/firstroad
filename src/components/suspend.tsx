import { Suspense, ViewTransition, type ViewTransitionProps } from "react";

interface SuspendProps
  extends Omit<React.ComponentProps<typeof Suspense>, "name">,
    ViewTransitionProps {}

const Suspend = ({ children, fallback, ...props }: SuspendProps) => {
  return (
    <Suspense fallback={fallback}>
      <ViewTransition {...props}>{children}</ViewTransition>
    </Suspense>
  );
};

export { Suspend };
