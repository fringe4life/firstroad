import { ViewTransition } from "react";

const PasswordLayout = ({ children }: LayoutProps<"/">) => (
  <div className="row-span-3 grid place-items-center">
    <div className="w-full max-w-120">
      <ViewTransition enter="slide-left" exit="slide-right-skew">
        {children}
      </ViewTransition>
    </div>
  </div>
);

export default PasswordLayout;
