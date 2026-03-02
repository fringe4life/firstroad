const SelectActiveOrganisationLayout = ({
  children,
}: LayoutProps<"/onboarding/select-active-organisation">) => (
  <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
    {children}
  </div>
);

export default SelectActiveOrganisationLayout;
