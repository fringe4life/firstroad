import { ViewTransition } from "react";

export default function PasswordLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="row-span-3 grid place-items-center">
      <div className="w-full max-w-120">
        <ViewTransition enter="slide-left" exit="slide-right-skew">
          {children}
        </ViewTransition>
      </div>
    </div>
  );
}
