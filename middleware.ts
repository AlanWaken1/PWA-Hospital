import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;

    if (
        url.startsWith("/api/manifest") ||
        url.startsWith("/sw.js") ||
        url.startsWith("/icons/")
    ) {
        return NextResponse.next();
    }
    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/manifest|api/auth|sw.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

