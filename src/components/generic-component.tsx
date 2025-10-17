export type GenericComponentProps<T, P, E extends React.ElementType = "div"> = {
  Component: React.ComponentType<P>;
  items: T[];
  renderProps: (item: T, index: number) => P;
  renderKey: (item: T, index: number) => React.Key;
  className?: string;
  as?: E;
  wrapperProps?: React.ComponentPropsWithoutRef<E>;
};
const GenericComponent = <T, P, E extends React.ElementType = "div">({
  Component,
  items,
  renderProps,
  renderKey,
  className = "",
  as,
  wrapperProps,
}: GenericComponentProps<T, P, E>) => {
  const Wrapper = as || "div";
  return (
    <Wrapper className={className} {...wrapperProps}>
      {items.map((item, index) => (
        <Component key={renderKey(item, index)} {...renderProps(item, index)} />
      ))}
    </Wrapper>
  );
};

export default GenericComponent;
