"use client";

import { useEffect, useState } from "react";

export type AuthUser = {
  email: string;
  role: "Admin" | "User";
  userId: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data: AuthUser | null) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
