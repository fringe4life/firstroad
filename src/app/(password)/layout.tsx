import { ViewTransition } from "react";

const PasswordLayout = ({ children }: LayoutProps<"/">) => (
  <ViewTransition enter="slide-left" exit="slide-right-skew">
    <div className="grid h-full place-content-center">
      <div className="max-content-narrow">{children}</div>
    </div>
  </ViewTransition>
);

export default PasswordLayout;
