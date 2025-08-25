import { RedirectToast } from "@/components/redirect-toast";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children} <RedirectToast />
    </div>
  );
}
