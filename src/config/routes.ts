/**
 * Route configuration for the application
 * Centralized route management for better maintainability
 */

export const RouteRole = {
  PUBLIC: "public",
  TALENT: "talent",
  EMPLOYER: "employer",
  BOTH: "talent,employer",
} as const;

export type RouteRole = (typeof RouteRole)[keyof typeof RouteRole];

export interface RouteConfig {
  path: string;
  title: string;
  roles?: RouteRole[];
  description?: string;
}

/**
 * Public routes - accessible without authentication
 */
export const PUBLIC_ROUTES: Record<string, RouteConfig> = {
  HOME: {
    path: "/",
    title: "Home",
    roles: [RouteRole.PUBLIC],
    description: "Landing page",
  },
  LOGIN: {
    path: "/login",
    title: "Login",
    roles: [RouteRole.PUBLIC],
    description: "User login page",
  },
  SIGNUP: {
    path: "/signup",
    title: "Sign Up",
    roles: [RouteRole.PUBLIC],
    description: "User registration page",
  },
  OTP_VERIFICATION: {
    path: "/verify-otp",
    title: "Verify OTP",
    roles: [RouteRole.PUBLIC],
    description: "OTP verification page",
  },
  PUBLIC_PROFILE: {
    path: "/freelancer-profile/:id",
    title: "Public Profile",
    roles: [RouteRole.PUBLIC],
    description: "Public freelancer profile view",
  },
  UNAUTHORIZED: {
    path: "/unauthorized",
    title: "Unauthorized",
    roles: [RouteRole.PUBLIC],
    description: "Unauthorized access page",
  },
  NOT_FOUND: {
    path: "*",
    title: "Not Found",
    roles: [RouteRole.PUBLIC],
    description: "404 error page",
  },
};

/**
 * Talent routes - accessible only by talent users
 */
export const TALENT_ROUTES: Record<string, RouteConfig> = {
  DASHBOARD: {
    path: "/talent-dashboard",
    title: "Talent Dashboard",
    roles: [RouteRole.TALENT],
    description: "Main dashboard for talent users",
  },
  PROFILE: {
    path: "/talent-profile",
    title: "My Profile",
    roles: [RouteRole.TALENT],
    description: "Talent profile management",
  },
  PROFILE_EDIT: {
    path: "/talent-profile/:id",
    title: "Edit Profile",
    roles: [RouteRole.TALENT],
    description: "Edit specific profile section",
  },
  APPLICATIONS: {
    path: "/my-applications",
    title: "My Applications",
    roles: [RouteRole.TALENT],
    description: "View job applications",
  },
  APPLY_JOB: {
    path: "/apply/:jobId",
    title: "Apply to Job",
    roles: [RouteRole.TALENT],
    description: "Job application form",
  },
  BILLING: {
    path: "/billing",
    title: "Billing",
    roles: [RouteRole.TALENT],
    description: "Billing information management",
  },
};

/**
 * Employer routes - accessible only by employer users
 */
export const EMPLOYER_ROUTES: Record<string, RouteConfig> = {
  DASHBOARD: {
    path: "/employer-dashboard",
    title: "Employer Dashboard",
    roles: [RouteRole.EMPLOYER],
    description: "Main dashboard for employer users",
  },
  POST_JOB: {
    path: "/post-job",
    title: "Post Job",
    roles: [RouteRole.EMPLOYER],
    description: "Post a new job listing",
  },
  JOB_APPLICATIONS: {
    path: "/job-applications",
    title: "Job Applications",
    roles: [RouteRole.EMPLOYER],
    description: "View job applications",
  },
};

/**
 * Shared routes - accessible by both talent and employer users
 */
export const SHARED_ROUTES: Record<string, RouteConfig> = {
  MESSAGES: {
    path: "/messages",
    title: "Messages",
    roles: [RouteRole.TALENT, RouteRole.EMPLOYER],
    description: "Messaging system",
  },
};

/**
 * All routes combined
 */
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...TALENT_ROUTES,
  ...EMPLOYER_ROUTES,
  ...SHARED_ROUTES,
};

/**
 * Legacy route mappings for backward compatibility
 * These map old route paths to new ones
 */
export const LEGACY_ROUTE_MAPPINGS: Record<string, string> = {
  // No legacy mappings needed - using original paths
};

/**
 * Helper function to build route paths with parameters
 */
export function buildRoute(
  routeConfig: RouteConfig,
  params?: Record<string, string | number>,
): string {
  let path = routeConfig.path;
  if (params) {
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, String(params[key]));
    });
  }
  return path;
}

/**
 * Helper function to check if user has access to route
 */
export function hasRouteAccess(
  userRoles: string[],
  routeRoles: RouteRole[],
): boolean {
  if (routeRoles.includes(RouteRole.PUBLIC)) return true;
  if (routeRoles.includes(RouteRole.BOTH)) return true;
  return userRoles.some((role) => routeRoles.includes(role as RouteRole));
}
