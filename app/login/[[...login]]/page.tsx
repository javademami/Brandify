"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    }}>
      {/* فقط خود کامپوننت کلرک را قرار می‌دهیم. کلرک خودش باکس سفید را می‌سازد */}
      <SignIn 
        path="/login" 
        routing="path"
        signUpUrl="/login"
        forceRedirectUrl="/account" 
      />
    </div>
  );
}
