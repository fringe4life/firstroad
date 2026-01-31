import { Calendar, CheckCircle2, Mail, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/features/auth/types";
import type { Maybe } from "@/types";

interface UserProfileCardProps {
  user: User;
}

const getInitials = (name: Maybe<string>): string => {
  if (!name) {
    return "?";
  }
  // biome-ignore lint/performance/useTopLevelRegex: will fix later
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) {
    return "Unknown";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const initials = getInitials(user.name);

  return (
    <Card className="md:row-span-2 md:grid md:grid-rows-subgrid">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <Avatar className="aspect-square w-8">
              {user.image ? (
                <AvatarImage alt={user.name ?? "User"} src={user.image} />
              ) : null}
              <AvatarFallback className="bg-primary font-semibold text-lg text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.name ?? "User"}</h3>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>

          {/* Email Verification Status */}
          <div className="flex items-center gap-3">
            {user.emailVerified ? (
              <>
                <CheckCircle2 className="size-5 text-green-600" />
                <span className="text-sm">Email verified</span>
              </>
            ) : (
              <>
                <XCircle className="size-5 text-destructive" />
                <span className="text-sm">Email not verified</span>
              </>
            )}
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-muted-foreground" />
            <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { UserProfileCard };
