"use client";

import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) return null;

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";

  const email =
    user?.primaryEmailAddress?.emailAddress || "No email";

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` ||
    "U";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8f9fc 0%, #f4f5f9 100%)",
        color: "#111827",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          height: "72px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            height: "100%",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "17px",
                fontWeight: 800,
                boxShadow:
                  "0 5px 15px rgba(99,102,241,0.25)",
              }}
            >
              B
            </div>

            <span
              style={{
                fontSize: "18px",
                fontWeight: 750,
                letterSpacing: "-0.4px",
                color: "#111827",
              }}
            >
              Brandify
            </span>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <button
              onClick={() => router.push("/generate")}
              style={{
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#374151",
                height: "38px",
                padding: "0 15px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: 650,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c7d2fe";
                e.currentTarget.style.background = "#f8f7ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#fff";
              }}
            >
              + Create Logo
            </button>

            <UserButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "42px 24px 70px",
        }}
      >
        {/* Page Heading */}
        <section
          style={{
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "13px",
              fontWeight: 650,
              color: "#6366f1",
              letterSpacing: "0.2px",
            }}
          >
            ACCOUNT
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              lineHeight: 1.15,
              fontWeight: 780,
              letterSpacing: "-1.2px",
              color: "#111827",
            }}
          >
            Welcome back, {user?.firstName || "there"}.
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              color: "#6b7280",
            }}
          >
            Manage your profile and access your logo projects.
          </p>
        </section>

        {/* Dashboard Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(300px, 0.8fr)",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          {/* Profile Card */}
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow:
                "0 4px 20px rgba(17,24,39,0.04)",
            }}
          >
            {/* Profile Header */}
            <div
              style={{
                padding: "26px 28px",
                borderBottom: "1px solid #eef0f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  minWidth: 0,
                }}
              >
                {/* Avatar */}
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={fullName}
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "16px",
                      objectFit: "cover",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      flexShrink: 0,
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: 750,
                    }}
                  >
                    {initials.toUpperCase()}
                  </div>
                )}

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "19px",
                      fontWeight: 750,
                      color: "#111827",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {fullName}
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: "13px",
                      color: "#6b7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {email}
                  </p>
                </div>
              </div>

              <span
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 9px",
                  borderRadius: "999px",
                  background: "#ecfdf5",
                  color: "#047857",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />
                Active
              </span>
            </div>

            {/* Profile Information */}
            <div
              style={{
                padding: "26px 28px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "18px",
                }}
              >
                <InfoItem
                  label="Full Name"
                  value={fullName}
                />

                <InfoItem
                  label="Email Address"
                  value={email}
                />

                <InfoItem
                  label="Member Since"
                  value={
                    user?.createdAt
                      ? user.createdAt.toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "—"
                  }
                />

                <InfoItem
                  label="Account"
                  value="Personal"
                />
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section
            style={{
              background: "#111827",
              borderRadius: "18px",
              padding: "26px",
              color: "#fff",
              boxShadow:
                "0 10px 30px rgba(17,24,39,0.12)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative gradient */}
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background:
                  "rgba(99,102,241,0.22)",
                filter: "blur(45px)",
                top: "-80px",
                right: "-60px",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  color: "#a5b4fc",
                  textTransform: "uppercase",
                }}
              >
                Quick actions
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: 750,
                  letterSpacing: "-0.5px",
                }}
              >
                What would you like to do?
              </h2>

              <p
                style={{
                  margin: "9px 0 24px",
                  color: "#9ca3af",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                Create something new or continue
                working on your existing logos.
              </p>

              <button
                onClick={() => router.push("/generate")}
                style={{
                  width: "100%",
                  height: "46px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: "10px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                ✦ Create New Logo
              </button>

              <button
                onClick={() =>
                  router.push("/account/saved-logos")
                }
                style={{
                  width: "100%",
                  height: "46px",
                  border:
                    "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "10px",
                  background:
                    "rgba(255,255,255,0.06)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 650,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.11)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.06)";
                }}
              >
                ◈ View Saved Logos
              </button>
            </div>
          </section>
        </div>

        {/* Workspace Section */}
        <section
          style={{
            marginTop: "22px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "28px",
            boxShadow:
              "0 4px 20px rgba(17,24,39,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                  fontWeight: 750,
                  color: "#111827",
                  letterSpacing: "-0.3px",
                }}
              >
                Your Workspace
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Your branding tools and saved projects.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {/* Saved Logos */}
            <ActionCard
              icon="◈"
              title="Saved Logos"
              description="View, edit and manage your saved logo designs."
              buttonText="Open Saved Logos"
              onClick={() =>
                router.push("/account/saved-logos")
              }
            />

            {/* Create */}
            <ActionCard
              icon="✦"
              title="Logo Generator"
              description="Create a new professional logo for your brand."
              buttonText="Start Creating"
              onClick={() => router.push("/generate")}
            />
          </div>
        </section>

        {/* Footer */}
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "12px",
          }}
        >
          Brandify Account
        </div>
      </main>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 800px) {
          main {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          header > div {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          main > div:first-of-type {
            grid-template-columns: 1fr !important;
          }

          section div[style*="repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 520px) {
          header button {
            display: none;
          }

          h1 {
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------- */
/* Info Item                                           */
/* -------------------------------------------------- */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #eef0f3",
        borderRadius: "11px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "7px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#374151",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* Action Card                                         */
/* -------------------------------------------------- */

function ActionCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          "#c7d2fe";
        e.currentTarget.style.boxShadow =
          "0 8px 22px rgba(17,24,39,0.06)";
        e.currentTarget.style.transform =
          "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          flexShrink: 0,
          borderRadius: "12px",
          background: "#f3f4ff",
          color: "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "19px",
          fontWeight: 700,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "4px 0 10px",
            fontSize: "12px",
            lineHeight: 1.45,
            color: "#6b7280",
          }}
        >
          {description}
        </p>

        <button
          onClick={onClick}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            color: "#6366f1",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {buttonText} →
        </button>
      </div>
    </div>
  );
}