import Cookies from "js-cookie";
import api from "./axios";
import type {
  ApiResponse,
  LoginFormData,
  LoginResponse,
  MeResponse,
  RegisterFormData,
  RegisterResponse,
  User,
  UserRole,
} from "@/types";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";
const USER_KEY = "auth_user";

const REMEMBERED_EMAIL_KEY = "remembered_email";

// Dynamic cookie options: 30 days if rememberMe is true, session cookie (expires on browser close) if false
function getCookieOptions(remember: boolean = true): Cookies.CookieAttributes {
  return {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(remember ? { expires: 30 } : {}),
  };
}

// ─── Token Management ──────────────────────────────

export function saveToken(token: string, remember: boolean = true): void {
  Cookies.set(TOKEN_KEY, token, getCookieOptions(remember));
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}

// ─── Role Management ───────────────────────────────

export function saveRole(role: UserRole, remember: boolean = true): void {
  Cookies.set(ROLE_KEY, role, getCookieOptions(remember));
}

export function getRole(): UserRole | undefined {
  return Cookies.get(ROLE_KEY) as UserRole | undefined;
}

export function removeRole(): void {
  Cookies.remove(ROLE_KEY, { path: "/" });
}

// ─── Remembered Email Management ───────────────────

export function saveRememberedEmail(email: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
  }
}

export function getRememberedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REMEMBERED_EMAIL_KEY);
}

export function removeRememberedEmail(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
}

// ─── User Cache (localStorage) ─────────────────────

export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? (JSON.parse(data) as User) : null;
}

export function removeCachedUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

// ─── Auth API Calls ────────────────────────────────

export async function login(data: LoginFormData, remember: boolean = true): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
  const { user, token, role } = response.data.data;

  saveToken(token, remember);
  saveRole(role, remember);
  saveUser(user);

  if (remember) {
    saveRememberedEmail(data.email);
  } else {
    removeRememberedEmail();
  }

  return response.data.data;
}

export async function register(data: RegisterFormData): Promise<RegisterResponse> {
  const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", data);
  const { user, token } = response.data.data;

  saveToken(token);
  saveRole("applicant");
  saveUser(user);

  return response.data.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Proceed with local cleanup even if API call fails
  }
  removeToken();
  removeRole();
  removeCachedUser();
}

export async function getUser(): Promise<MeResponse | null> {
  try {
    const response = await api.get<ApiResponse<MeResponse>>("/auth/me");
    const meData = response.data.data;
    saveUser(meData.user);
    saveRole(meData.user.role);
    return meData;
  } catch {
    return null;
  }
}

// ─── Auth State Checks ─────────────────────────────

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(role: UserRole): boolean {
  return getRole() === role;
}

export function getRoleDashboardPath(role?: UserRole): string {
  const r = role || getRole();
  switch (r) {
    case "applicant":
      return "/dashboard";
    case "admin":
    case "head":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}
