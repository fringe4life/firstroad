const AccountLayout = ({ children }: LayoutProps<"/account">) => (
  <div className="grid h-full w-full grid-rows-[min-content_min-content_min-content_1fr] place-items-center gap-y-8">
    {children}
  </div>
);

export default AccountLayout;
