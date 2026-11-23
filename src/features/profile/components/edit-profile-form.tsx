"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { images } from "@/assets/images";
import { Field, TextField } from "@/components/shared/form-field";
import { ErrorState } from "@/components/shared/state-views";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { applyFieldErrors, getErrorMessage } from "@/lib/api/axios";
import { useMe, useUpdateProfile } from "@/lib/query/use-me";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import { isOptimizableImage, toImageSrc } from "@/lib/utils";
import type { MyProfile } from "@/types/user";

/** /profile/edit — PATCH /api/me (multipart, optional avatar). */
export function EditProfileView() {
  const me = useMe();
  if (me.isPending) return <EditProfileSkeleton />;
  if (me.isError || !me.data)
    return <ErrorState message="Couldn't load your profile." onRetry={() => me.refetch()} />;
  return <EditProfileForm profile={me.data} />;
}

function EditProfileForm({ profile }: { profile: MyProfile }) {
  const router = useRouter();
  const update = useUpdateProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      avatar: undefined,
    },
  });

  const avatar = useWatch({ control, name: "avatar" });
  const preview = useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const onSubmit = handleSubmit((values) => {
    update.mutate(
      {
        name: values.name,
        username: values.username,
        phone: values.phone || undefined,
        bio: values.bio,
        avatar: values.avatar,
      },
      {
        onSuccess: () => {
          toast.success("Profile Success Update");
          router.push("/profile");
        },
        onError: (error) => {
          const applied = applyFieldErrors(error, ["name", "username", "phone", "bio"], setError);
          if (!applied) {
            const message = getErrorMessage(error, "Could not update profile");
            if (/username/i.test(message)) setError("username", { type: "server", message });
            else toast.error(message);
          }
        },
      },
    );
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-3xl md:flex-row md:items-start md:gap-4xl"
    >
      <div className="flex flex-col items-center gap-xl md:w-40 md:shrink-0">
        <Image
          src={preview ?? toImageSrc(profile.avatarUrl) ?? images.avatarDefault}
          alt={profile.name}
          width={130}
          height={130}
          unoptimized={Boolean(preview) || !isOptimizableImage(toImageSrc(profile.avatarUrl))}
          className="size-20 rounded-full bg-neutral-900 object-cover md:size-[130px]"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("avatar", file, { shouldDirty: true, shouldValidate: true });
            e.target.value = "";
          }}
        />
        <Button variant="secondary" className="w-40" onClick={() => fileRef.current?.click()}>
          Change Photo
        </Button>
        {errors.avatar && (
          <p className="text-sm font-medium text-destructive">{errors.avatar.message}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-xl md:max-w-[592px] md:gap-2xl">
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Username"
          autoComplete="username"
          error={errors.username?.message}
          {...register("username")}
        />
        <Field label="Email">
          {(a11y) => (
            <Input
              {...a11y}
              value={profile.email}
              readOnly
              aria-readonly
              title="Email can't be changed"
            />
          )}
        </Field>
        <TextField
          label="Number Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Field label="Bio" error={errors.bio?.message}>
          {(a11y) => <Textarea {...a11y} placeholder="Create your bio" {...register("bio")} />}
        </Field>
        <Button type="submit" className="w-full" disabled={update.isPending || !isDirty}>
          {update.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function EditProfileSkeleton() {
  return (
    <div className="flex flex-col gap-3xl md:flex-row md:gap-4xl">
      <div className="flex flex-col items-center gap-xl md:w-40">
        <Skeleton className="size-20 rounded-full md:size-[130px]" />
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-xl md:max-w-[592px]">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-[74px] w-full" />
        ))}
      </div>
    </div>
  );
}
