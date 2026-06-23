"use client";

import { useRouter, useSearchParams } from "next/navigation";

type FilterUpdates = Record<string, string>;

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilters(updates: FilterUpdates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/dashboard?${params.toString()}`);
  }

  function getParam(key: string, fallback = "") {
    return searchParams.get(key) ?? fallback;
  }

  return { updateFilters, getParam, searchParams };
}
