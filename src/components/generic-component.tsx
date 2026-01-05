import { Bug, CircleSlash2 } from "lucide-react";
import { Placeholder } from "@/components/placeholder";
import type { Id, List } from "@/types";

export interface GenericComponentProps<
  T,
  P,
  E extends React.ElementType = "div",
> {
  Component: React.ComponentType<P>;
  items: List<T>;
  renderProps: (item: T, index: number) => P;
  // renderKey: (item: T, index: number) => React.Key;
  className?: string;
  as?: E;
  wrapperProps?: React.ComponentPropsWithoutRef<E>;
  emptyStateMessage: string;
  errorStateMessage?: string;
}
const GenericComponent = <
  T extends Id,
  P,
  E extends React.ElementType = "div",
>({
  Component,
  items,
  renderProps,
  // renderKey,
  className = "",
  as,
  wrapperProps,
  emptyStateMessage,
  errorStateMessage = "An error occurred while fetching the data",
}: GenericComponentProps<T, P, E>) => {
  const isError = !items;
  const isEmpty = !isError && items.length === 0;
  const message = isError ? errorStateMessage : emptyStateMessage;
  const icon = isError ? <Bug /> : <CircleSlash2 />;
  if (isError || isEmpty) {
    return <Placeholder icon={icon} label={message} />;
  }

  const Wrapper = as || "div";
  return (
    <Wrapper className={className} {...wrapperProps}>
      {items.map((item, index) => (
        <Component key={item.id} {...renderProps(item, index)} />
      ))}
    </Wrapper>
  );
};

export { GenericComponent };
