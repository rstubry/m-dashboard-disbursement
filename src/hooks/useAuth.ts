"use client";

import { useSyncExternalStore } from "react";
import { decodeJWT, isTokenExpired } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/constants";
import type { AuthState } from "@/models/base";

const UNAUTHENTICATED: AuthState = {
  isAuthenticated: false,
  username: null,
  role: null,
  isExpired: false,
};

let cached: AuthState = UNAUTHENTICATED;

function getSnapshot(): AuthState {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  const token = match ? match.split("=")[1] : null;

  if (!token) return UNAUTHENTICATED;

  const payload = decodeJWT(token);
  if (!payload) return UNAUTHENTICATED;

  const expired = isTokenExpired(token);
  const next: AuthState = {
    isAuthenticated: !expired,
    username: payload.username,
    role: payload.role,
    isExpired: expired,
  };

  if (
    cached.isAuthenticated === next.isAuthenticated &&
    cached.username === next.username &&
    cached.role === next.role &&
    cached.isExpired === next.isExpired
  ) {
    return cached;
  }

  cached = next;
  return cached;
}

export function useAuth(): AuthState {
  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    () => UNAUTHENTICATED,
  );
}
