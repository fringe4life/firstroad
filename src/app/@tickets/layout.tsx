export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid justify-center gap-y-8">
      {/* Always show tickets list */}
      {children}
    </div>
  );
}
