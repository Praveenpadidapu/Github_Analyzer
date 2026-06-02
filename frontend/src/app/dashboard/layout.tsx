"use client";
import React, { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setGithubToken } = useAppStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setGithubToken(token);
      // Clean up the URL
      router.replace(pathname);
    }
  }, [searchParams, router, pathname, setGithubToken]);

  return (
    <div className="flex h-screen bg-[#050816] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
