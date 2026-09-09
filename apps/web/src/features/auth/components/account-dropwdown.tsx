import { LucideLock, LucideUser } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
    <DropdownMenuTrigger
      render={
        <Button className="relative size-8 rounded-full p-0" variant="ghost" />
      }
    >
      <Avatar>
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        <AvatarImage src={user?.image || ""} />
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem render={<Link href={accountProfilePath()} />}>
          <LucideUser className="mr-2 aspect-square h-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={accountPasswordPath()} />}>
          <LucideLock className="mr-2 aspect-square h-4" />
          <span>Password</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          nativeButton
          render={
            <SignOutButton className="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden" />
          }
        />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

export { AccountDropdown };
