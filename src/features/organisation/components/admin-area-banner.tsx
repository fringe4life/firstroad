import { ShieldCheck } from "lucide-react";

const AdminAreaBanner = () => {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-amber-900 text-sm dark:text-amber-100">
            You're in the Admin Area
          </p>
          <p className="text-amber-700 text-xs dark:text-amber-300">
            Managing organizations requires admin privileges
          </p>
        </div>
      </div>
    </div>
  );
};

export { AdminAreaBanner };
