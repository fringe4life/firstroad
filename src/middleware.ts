import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signInPath } from "@/path";

export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		return NextResponse.redirect(new URL(signInPath, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/tickets", "/account/:path*"],
	runtime: "nodejs",
};
