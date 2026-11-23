"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordField, TextField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { applyFieldErrors, getErrorMessage, getErrorStatus } from "@/lib/api/axios";
import { useLogin } from "@/lib/query/use-auth";
import { safeRedirect } from "@/lib/safe-redirect";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Login successful");
        router.replace(safeRedirect(searchParams.get("redirect")));
        router.refresh();
      },
      onError: (error) => {
        if (getErrorStatus(error) === 401) {
          // The API doesn't say which one is wrong, so both inputs get the message.
          setError("email", { type: "server", message: " " });
          setError("password", { type: "server", message: "Invalid email or password" });
          return;
        }
        if (!applyFieldErrors(error, ["email", "password"], setError)) {
          toast.error(getErrorMessage(error, "Login failed"));
        }
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-2xl">
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        error={errors.email?.message?.trim() || undefined}
        aria-invalid={Boolean(errors.email)}
        {...register("email")}
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? "Logging in…" : "Login"}
      </Button>
      <p className="text-center text-sm font-semibold tracking-minus-2 text-neutral-25 md:text-md">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-primary-200 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
