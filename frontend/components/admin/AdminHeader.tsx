"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="fixed left-[260px] right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b bg-white px-8">

      <div>
        <h2 className="text-lg font-bold text-[#0a1f4e]">
          Admin Dashboard
        </h2>

        <p className="text-xs text-gray-500">
          Manage your website content
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Logout
      </button>

    </header>
  );
}