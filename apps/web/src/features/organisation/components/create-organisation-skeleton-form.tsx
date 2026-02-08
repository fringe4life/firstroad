import { Skeleton } from "@/components/ui/skeleton";

const CreateOrganisationSkeletonForm = () => {
  return (
    <div className="grid gap-y-2">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full bg-primary/50" />
    </div>
  );
};

export { CreateOrganisationSkeletonForm };
