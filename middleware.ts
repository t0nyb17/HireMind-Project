// import { authMiddleware } from '@clerk/nextjs/server'

// export default authMiddleware({
//   // Routes that can be accessed while signed out
//   publicRoutes: [
//     '/',
//     '/sign-in(.*)',
//     '/sign-up(.*)',
//     '/jobs(.*)',
//     '/api/webhooks(.*)',
//   ],
//   // Routes that can always be accessed, and have
//   // no authentication information
//   ignoredRoutes: [
//     '/api/webhooks(.*)',
//   ],
// })

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// }

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/jobs(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
