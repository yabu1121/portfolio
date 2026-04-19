import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => { 
  const auth = req.headers.get("authorization")
  if(!auth) return new NextResponse('Auth required', {
    status: 401,
    headers: {'WWW-Authenticate': 'Basic realm="admin"'}
  })
  const [user, pass] = atob(auth.split(' ')[1]).split(':')
  if(user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', {status: 401})
  }
}

export const config = { matcher: ['/admin/:path*']}