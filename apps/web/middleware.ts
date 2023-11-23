import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

// Configure middleware to exclude static files and the public folder
export const config = {
  matcher: ["/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};
