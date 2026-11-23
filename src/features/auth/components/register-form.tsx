"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordField, TextField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { applyFieldErrors, getErrorMessage } from "@/lib/api/axios";
import { useRegister } from "@/lib/query/use-auth";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

const API_FIELDS = ["name", "username", "email", "phone", "password"] as const;

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(({ name, username, email, phone, password }) => {
    registerUser.mutate(
      { name, username, email, phone, password },
      {
        onSuccess: () => {
          toast.success("Register successful");
          router.replace("/");
          router.refresh();
        },
        onError: (error) => {
          if (applyFieldErrors(error, API_FIELDS, setError)) return;
          // e.g. "Email already registered" / "Username already taken"
          const message = getErrorMessage(error, "Register failed");
          const field = API_FIELDS.find((f) => message.toLowerCase().includes(f));
          if (field) setError(field, { type: "server", message });
          else toast.error(message);
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-2xl">
      <TextField
        label="Name"
        autoComplete="name"
        placeholder="Enter your name"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        label="Username"
        autoComplete="username"
        placeholder="Enter your username"
        error={errors.username?.message}
        {...register("username")}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Number Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Enter your number phone"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <PasswordField
        label="Password"
        autoComplete="new-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        label="Confirm Password"
        autoComplete="new-password"
        placeholder="Enter your confirm password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" className="w-full" disabled={registerUser.isPending}>
        {registerUser.isPending ? "Submitting…" : "Submit"}
      </Button>
      <p className="text-center text-sm font-semibold tracking-minus-2 text-neutral-25 md:text-md">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary-200 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
