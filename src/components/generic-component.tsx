import { Placeholder } from "@/components/placeholder";
import type { List } from "@/features/pagination/types";

export interface GenericComponentProps<
  T,
  P,
  E extends React.ElementType = "div",
> {
  Component: React.ComponentType<P>;
  items: List<T>;
  renderProps: (item: T, index: number) => P;
  renderKey: (item: T, index: number) => React.Key;
  className?: string;
  as?: E;
  wrapperProps?: React.ComponentPropsWithoutRef<E>;
  emptyStateMessage: string;
}
const GenericComponent = <T, P, E extends React.ElementType = "div">({
  Component,
  items,
  renderProps,
  renderKey,
  className = "",
  as,
  wrapperProps,
  emptyStateMessage,
}: GenericComponentProps<T, P, E>) => {
  const isError = !items;
  const isEmpty = !isError && items.length === 0;

  if (isError || isEmpty) {
    return <Placeholder label={emptyStateMessage} />;
  }

  const Wrapper = as || "div";
  return (
    <Wrapper className={className} {...wrapperProps}>
      {items.map((item, index) => (
        <Component key={renderKey(item, index)} {...renderProps(item, index)} />
      ))}
    </Wrapper>
  );
};

export { GenericComponent };
