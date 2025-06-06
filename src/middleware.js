import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "8f11a5d4-2d1a-429a-a2a9-bd5cfb12ff33");
  requestHeaders.set("x-createxyz-project-group-id", "cbd812fc-474d-4a60-9dfd-223388c071cd");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}