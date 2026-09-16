export interface CurrentUser {
  email: string;
  name: string;
  role: string;
}

const SESSION_KEY = "dt_admin_session";
const USER_KEY = "dt_admin_user";
const FALLBACK_USER: CurrentUser = { email: "", name: "Admin", role: "Admin" };

function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[.\-_]/).filter(Boolean);
  if (parts.length === 0) return "Admin";
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function login(email: string): void {
  if (typeof window === "undefined") return;
  const user: CurrentUser = {
    email,
    name: deriveNameFromEmail(email),
    role: "Admin",
  };
  window.localStorage.setItem(SESSION_KEY, "true");
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_KEY) === "true";
}

export function getCurrentUser(): CurrentUser {
  if (typeof window === "undefined") return FALLBACK_USER;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return FALLBACK_USER;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return FALLBACK_USER;
  }
}
