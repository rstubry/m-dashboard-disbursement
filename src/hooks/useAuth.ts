"use client";

import { decodeJWT, isTokenExpired } from "@/lib/jwt";
import { AuthState } from "@/models/base";

const COOKIE_NAME = "token";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
}

export function useAuth(): AuthState {
  const token = getCookieValue(COOKIE_NAME);

  if (!token) {
    return {
      isAuthenticated: false,
      username: null,
      role: null,
      isExpired: false,
    };
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return {
      isAuthenticated: false,
      username: null,
      role: null,
      isExpired: false,
    };
  }

  const expired = isTokenExpired(token);
  return {
    isAuthenticated: !expired,
    username: payload.username,
    role: payload.role,
    isExpired: expired,
  };
}
