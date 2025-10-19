export default function PasswordLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="row-span-3 grid place-items-center">
      <div className="w-full max-w-120 animate-fade-from-top">{children}</div>
    </div>
  );
}
