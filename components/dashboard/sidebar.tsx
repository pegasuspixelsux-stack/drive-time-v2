"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Target,
  Mail,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Control Panel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/dashboard/inventory", icon: Car },
  { label: "Leads", href: "/dashboard/leads", icon: Target },
  { label: "Contact Us", href: "/dashboard/contact", icon: Mail },
  { label: "Users", href: "/dashboard/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
          DriveTime
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_LINKS.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <button
            type="button"
            aria-label="Settings"
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            type="button"
            aria-label="Log out"
            onClick={handleLogout}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-sm text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
