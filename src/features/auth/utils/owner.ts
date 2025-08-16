
import type { Session } from "next-auth";


type Entity = {
    userId: string | null | undefined
}

export const isOwner = async (session: Session | null, {userId}: Entity) => {
    if(!userId) return false

    return session?.user?.id === userId

}