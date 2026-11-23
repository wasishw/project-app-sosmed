"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Icon } from "./icon";

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}

/** Figma "Input Field": label (Text sm/Bold) + control + "Text Helper" in #B41759. */
export function Field({ label, error, className, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn("flex w-full flex-col gap-xxs", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="text-sm font-medium tracking-minus-3 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = ComponentProps<typeof Input> & { label: string; error?: string };

export function TextField({ label, error, className, ...inputProps }: TextFieldProps) {
  return (
    <Field label={label} error={error} className={className}>
      {(a11y) => <Input {...a11y} {...inputProps} />}
    </Field>
  );
}

/** Password with the eye / eye-off toggle from Figma. */
export function PasswordField({ label, error, className, ...inputProps }: TextFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} error={error} className={className}>
      {(a11y) => (
        <div className="relative">
          <Input {...a11y} {...inputProps} type={visible ? "text" : "password"} className="pr-12" />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute top-1/2 right-xl flex -translate-y-1/2 cursor-pointer text-neutral-500"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <Icon name={visible ? "eye-off" : "eye"} className="size-5" />
          </button>
        </div>
      )}
    </Field>
  );
}
