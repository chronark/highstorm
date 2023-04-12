import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withClerkMiddleware((_req: NextRequest) => {
  // if (req.nextUrl.pathname.startsWith("/docs")) {
  //   return NextResponse.rewrite(new URL(req.nextUrl.pathname, "https://docs.highstorm.app"));
  // }

  return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
  matcher: ["/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};
