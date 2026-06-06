import type React from "react";

type FormProps = React.ComponentPropsWithoutRef<"form">;

const Form = ({ action, children, onSubmit, ...formProps }: FormProps) => (
  <form
    action={action}
    className="grid gap-y-2"
    onSubmit={onSubmit}
    {...formProps}
  >
    {children}
  </form>
);

export { Form };
