import { LucideLock, LucideUser } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import type { User } from "@/features/auth/types";
import { accountPasswordPath, accountProfilePath } from "@/path";

interface AccountDropdownProps {
  user: User;
}

const AccountDropdown = ({ user }: AccountDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar>
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        <AvatarImage src={user?.image || ""} />
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href={accountProfilePath()}>
          <LucideUser className="mr-2 aspect-square h-4" />
          <span>Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={accountPasswordPath()}>
          <LucideLock className="mr-2 aspect-square h-4" />
          <span>Password</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SignOutButton className="flex w-full items-center" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export { AccountDropdown };
