"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  Target,
  MessageSquare,
  BookOpen,
} from "lucide-react";

// Navigation items with icons
const navItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { label: "Goals", icon: Target, href: "/goals" },
  { label: "AI Assistant", icon: MessageSquare, href: "/ai-assistant" },
  { label: "Journal History", icon: BookOpen, href: "/journal-history" },
];

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-white">
      <div className="p-6">
        <Link href="/dashboard">
          <h1 className="text-xl font-semibold text-gray-900">Goal Getter</h1>
        </Link>
      </div>
      <nav className="px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-white" : "text-gray-500",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
