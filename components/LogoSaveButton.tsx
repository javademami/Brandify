"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { LogoConfig } from "@/lib/generator";

export default function LogoSaveButton({ logo }: { logo: LogoConfig }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveLogo() {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/logos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: logo.name,
          slogan: logo.slogan,
          industry: logo.palette.bg,
          logoData: logo,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving logo:", error);
      alert("Failed to save logo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={saveLogo}
      disabled={saving}
      style={{
        background: saved ? "#10b981" : "#6366f1",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: saving ? "not-allowed" : "pointer",
        fontWeight: "600",
        fontSize: "14px",
        opacity: saving ? 0.7 : 1,
        transition: "all 0.2s",
      }}
    >
      {saving ? "Saving..." : saved ? "✓ Saved" : "💾 Save Logo"}
    </button>
  );
}