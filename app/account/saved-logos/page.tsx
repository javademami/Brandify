"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoView from "@/components/LogoView";

interface SavedLogo {
  _id: string;
  name: string;
  industry: string;
  logoData: any;
  createdAt: string;
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

    fetchLogos();
  }, [isSignedIn, router]);

  async function fetchLogos() {
    try {
      const res = await fetch("/api/logos/my-logos", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();

      setLogos(data);
    } catch (error) {
      console.error("Error fetching logos:", error);
    } finally {
      setLoading(false);
    }
  }

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
      await fetchLogos();
    } catch (error) {
      console.error("Error deleting logo:", error);
      alert("Failed to delete logo. Please try again.");
    }
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "40px",
          paddingTop: "20px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "20px",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111",
            marginBottom: "10px",
          }}
        >
          Saved Logos
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          {logos.length} logo{logos.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >
            Loading your logos...
          </div>
        ) : logos.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
              }}
            >
              🎨
            </div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111",
                marginBottom: "10px",
              }}
            >
              No saved logos yet
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "20px",
              }}
            >
              Create your first logo and save it here
            </p>

            <button
              onClick={() => router.push("/generate")}
              style={{
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Create Logo
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {logos.map((logo) => (
              <div
                key={logo._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    "0 1px 3px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLDivElement
                  ).style.boxShadow =
                    "0 8px 16px rgba(0, 0, 0, 0.1)";

                  (
                    e.currentTarget as HTMLDivElement
                  ).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLDivElement
                  ).style.boxShadow =
                    "0 1px 3px rgba(0, 0, 0, 0.1)";

                  (
                    e.currentTarget as HTMLDivElement
                  ).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Logo Preview */}
                <div
                  style={{
                    height: "180px",
                    overflow: "hidden",
                  }}
                >
                  <LogoView
                    key={`${logo._id}-${JSON.stringify(
                      logo.logoData
                    )}`}
                    logo={logo.logoData}
                  />
                </div>

                {/* Logo Information */}
                <div
                  style={{
                    padding: "15px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#111",
                      marginBottom: "5px",
                    }}
                  >
                    {logo.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "10px",
                    }}
                  >
                    {logo.industry}
                  </p>

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      marginBottom: "10px",
                    }}
                  >
                    {new Date(
                      logo.createdAt
                    ).toLocaleDateString()}
                  </p>

                  {/* Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    {/* Edit */}
                    <button
                      onClick={() =>
                        router.push(
                          `/editor?data=${encodeURIComponent(
                            JSON.stringify(
                              logo.logoData
                            )
                          )}`
                        )
                      }
                      style={{
                        flex: 1,
                        background: "#6366f1",
                        color: "white",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        deleteLogo(logo._id)
                      }
                      style={{
                        flex: 1,
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}