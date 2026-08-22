"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Palette, Pencil, Sparkles, Trash2 } from "lucide-react";
import LogoView from "@/components/LogoView";
import AccountHeader from "@/components/AccountHeader";
import type { LogoConfig } from "@/lib/generator";

interface SavedLogo {
  _id: string;
  name: string;
  industry: string;
  logoData: LogoConfig;
  createdAt: string;
}

/* ---------------------------------------------------------
   Helpers — keep raw CSS values (e.g. linear-gradient(...))
   out of the layout by detecting them early.
--------------------------------------------------------- */

const GRADIENT_RE = /(linear|radial)-gradient\(/i;

function isRawGradient(value?: string): boolean {
  return typeof value === "string" && GRADIENT_RE.test(value);
}

function safeDisplayName(name?: string): string {
  if (!name || !name.trim()) {
    return "Untitled logo";
  }

  // Never render a raw CSS string as a title
  if (isRawGradient(name)) {
    return "Untitled logo";
  }

  return name.trim();
}

/* ---------------------------------------------------------
   Micro badge — wraps metadata cleanly; gradients become a
   tiny swatch + "Gradient" label instead of a raw string.
--------------------------------------------------------- */

function MetaBadge({ value }: { value?: string }) {
  const text = (value ?? "").trim();

  if (!text) {
    return null;
  }

  if (isRawGradient(text)) {
    return (
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
          style={{ background: text }}
        />
        Gradient
      </span>
    );
  }

  return (
    <span className="inline-flex max-w-full items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
      <span className="truncate">{text}</span>
    </span>
  );
}

/* ---------------------------------------------------------
   Data loading — lives outside the component so it can be
   reused by both the initial load and the post-delete
   refresh without duplicating fetch logic.
--------------------------------------------------------- */

async function loadLogos(): Promise<SavedLogo[]> {
  const res = await fetch("/api/logos/my-logos", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
}

export default function SavedLogosPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [logos, setLogos] = useState<SavedLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    // All setState calls happen asynchronously inside promise
    // callbacks — never synchronously within the effect body.
    let cancelled = false;

    loadLogos()
      .then((data) => {
        if (!cancelled) {
          setLogos(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching logos:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, router]);

  async function deleteLogo(id: string) {
    if (!confirm("Are you sure you want to delete this logo?")) {
      return;
    }

    try {
      const res = await fetch(`/api/logos/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      // Immediately remove the deleted logo from the UI
      setLogos((prevLogos) =>
        prevLogos.filter((logo) => logo._id !== id)
      );

      // Sync the list with the database
      setLogos(await loadLogos());
    } catch (error) {
      console.error("Error deleting logo:", error);
      alert("Failed to delete logo. Please try again.");
    }
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/60">
      <AccountHeader active="saved-logos" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
        {/* ================= Header ================= */}
        <header className="mb-10">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition-colors duration-150 hover:bg-white hover:text-slate-800 hover:shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                Account
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                Saved Logos
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                All your brand marks in one place.
              </p>
            </div>

            {!loading && logos.length > 0 && (
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                {logos.length} logo{logos.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </header>

        {/* ================= Content ================= */}
        {loading ? (
          /* ---------- Loading skeletons ---------- */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-sm"
              >
                <div className="h-44 animate-pulse bg-slate-200/70" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200/70" />
                  <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-200/70" />

                  <div className="flex justify-end gap-2 pt-1">
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200/70" />
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logos.length === 0 ? (
          /* ---------- Empty state ---------- */
          <div className="animate-fade-in-up rounded-3xl border-2 border-dashed border-slate-300/80 bg-white/60 px-6 py-16 text-center backdrop-blur-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
              <Palette className="h-7 w-7" />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              No saved logos yet
            </h2>

            <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
              Create your first logo and save it here.
            </p>

            <button
              onClick={() => router.push("/generate")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Create Logo
            </button>
          </div>
        ) : (
          /* ---------- Logo grid ---------- */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {logos.map((logo, index) => (
              <article
                key={logo._id}
                style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
                className="group animate-fade-in-up overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                {/* Logo preview */}
                <div className="h-44 overflow-hidden border-b border-slate-100 bg-slate-50">
                  <LogoView
                    key={`${logo._id}-${JSON.stringify(logo.logoData)}`}
                    logo={logo.logoData}
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {safeDisplayName(logo.name)}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <MetaBadge value={logo.industry} />

                    <span className="inline-flex items-center gap-1 text-[11px] tabular-nums text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(logo.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    {/* Edit */}
                    <button
                      type="button"
                      title="Edit"
                      aria-label="Edit logo"
                      onClick={() =>
                        router.push(
                          `/editor?data=${encodeURIComponent(
                            JSON.stringify(logo.logoData)
                          )}`
                        )
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 active:scale-95"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      title="Delete"
                      aria-label="Delete logo"
                      onClick={() => deleteLogo(logo._id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}