import { Skeleton } from "@/components/ui/skeleton";

const OtpVerifyFormSkeleton = () => (
  <div className="space-y-4">
    {/* Optional "Code sent to" line */}
    <Skeleton className="h-4 w-48" />

    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      {/* OTP slots: two groups of 3 (h-9 w-9 each) */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <Skeleton aria-hidden className="h-4 w-4 shrink-0" />
        <div className="flex gap-0.5">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>

    <Skeleton className="h-10 w-full" />
  </div>
);

export { OtpVerifyFormSkeleton };
