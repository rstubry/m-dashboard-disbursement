import { JWTPayload } from "@/models/base";

const SECRET = "test-secret";

function base64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function encodeJWT(payload: Omit<JWTPayload, "exp">): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 jam
  const body = base64url(JSON.stringify({ ...payload, exp }));
  const signature = base64url(SECRET);
  return `${header}.${body}.${signature}`;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (!decoded.username || !decoded.role || !decoded.exp) return null;
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  return Math.floor(Date.now() / 1000) >= payload.exp;
}

export function isTokenValid(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return false;
  return !isTokenExpired(token);
}

export function setAuthCookie(token: string): void {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60}; SameSite=Lax`;
}
