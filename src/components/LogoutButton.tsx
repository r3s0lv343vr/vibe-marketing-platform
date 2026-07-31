"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="btn btn-secondary !py-2 disabled:opacity-60"
    >
      {loading ? "…" : "Log out"}
    </button>
  );
}
