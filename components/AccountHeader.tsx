"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

export type AccountTab = "account" | "saved-logos";

const TABS: { id: AccountTab; label: string; href: string }[] = [
  { id: "account", label: "My Account", href: "/account" },
  { id: "saved-logos", label: "Saved Logos", href: "/account/saved-logos" },
];

function TabLinks({
  active,
  className,
}: {
  active?: AccountTab;
  className?: string;
}) {
  return (
    <nav aria-label="Account navigation" className={className}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25"
                : "rounded-full px-4 py-1.5 text-xs font-semibold text-slate-500 transition-colors duration-150 hover:bg-white hover:text-slate-800 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:hover:shadow-none"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AccountHeader({ active }: { active?: AccountTab }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      {/* Top row */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-base font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 group-hover:-translate-y-0.5">
            B
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Brandify
          </span>
        </Link>

        {/* Tabs — desktop */}
        <TabLinks active={active} className="hidden items-center gap-1 md:flex" />

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Create Logo</span>
          </Link>

          <UserButton />
        </div>
      </div>

      {/* Tabs — mobile second row */}
      <div className="border-t border-slate-100 dark:border-slate-800 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-5 py-2 sm:px-8">
          <TabLinks active={active} className="flex items-center gap-1" />
        </div>
      </div>
    </header>
  );
}