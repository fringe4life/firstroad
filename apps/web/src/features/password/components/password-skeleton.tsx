import { CardHeaderSkeleton } from "@/components/skeletons/card-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ChangePasswordFormSkeleton } from "./change-password-form-skeleton";

const PasswordSkeleton = () => (
  <Card className="max-content-widest mx-auto">
    <CardHeaderSkeleton />
    <CardContent>
      <ChangePasswordFormSkeleton />
    </CardContent>
  </Card>
);

export { PasswordSkeleton };
