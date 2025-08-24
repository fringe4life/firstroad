import { signOutAction } from "@/features/auth/actions/signout"
import { LucideLock, LucideLogOut, LucideUser } from "lucide-react"
import type { User } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"


type AccountDropdownProps = {
    user: User
}

const AccountDropdown = ({user}: AccountDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                <AvatarFallback>
                    {user?.name?.charAt(0)}
                </AvatarFallback>
                <AvatarImage src={user?.image || ''} />
            </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account/profile">
            <LucideUser className="mr-2 h-4 aspect-square" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/password">
            <LucideLock className="mr-2 h-4 aspect-square" />
            <span>Password</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOutAction}>
            <LucideLogOut className="mr-2 h-4 aspect-square" />
            <button type="submit">Sign Out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>        
        </DropdownMenu>
    )
}

export default AccountDropdown;