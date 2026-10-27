import { NextRequest, NextResponse } from "next/server";
import { verifyBasicAuth } from "@/lib/auth";

export const middleware = (req: NextRequest) => {
  if (verifyBasicAuth(req.headers.get("authorization"))) {
    return NextResponse.next();
  }

  // API は fetch から呼ばれるので認証ダイアログは出さず JSON で返す
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
};

export const config = { matcher: ["/admin/:path*", "/api/upload"] };
