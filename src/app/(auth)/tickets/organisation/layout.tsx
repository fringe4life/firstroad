const TicketsOrganisationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="grid h-full w-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
    {children}
  </div>
);

export default TicketsOrganisationLayout;
