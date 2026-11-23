import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome Back!">
      {/* LoginForm reads ?redirect= (runtime data) */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
