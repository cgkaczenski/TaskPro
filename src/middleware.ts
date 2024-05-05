import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { currentUser } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const searchParams = req.nextUrl.searchParams;
  const redirectOnLogin = searchParams.get("redirectOnLogin");
  if (redirectOnLogin) {
    const user = await currentUser();
    if (user?.defaultProjectId) {
      return Response.redirect(
        new URL(`/app/project/${user.defaultProjectId}`, nextUrl)
      );
    } else {
      return Response.redirect(new URL(`/app/project`, nextUrl));
    }
  }

  if (isApiAuthRoute) {
    if (
      nextUrl.pathname.startsWith("/api/auth/auth/") &&
      nextUrl.searchParams.get("error")
    ) {
      const url = nextUrl;
      url.pathname = nextUrl.pathname.replace("/api/auth/", "");

      return Response.redirect(url);
    }

    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
