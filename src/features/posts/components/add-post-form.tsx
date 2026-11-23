"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icon } from "@/components/shared/icon";
import { Field } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api/axios";
import { useCreatePost } from "@/lib/query/use-posts";
import { cn } from "@/lib/utils";
import { addPostSchema, type AddPostValues } from "@/lib/validations/post";

/** /add-post — POST /api/posts (multipart: image + caption). */
export function AddPostForm() {
  const router = useRouter();
  const createPost = useCreatePost();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPostValues>({
    resolver: zodResolver(addPostSchema),
    defaultValues: { caption: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createPost.mutate(values, {
      onSuccess: () => {
        toast.success("Success Post");
        router.push("/");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Could not share your post")),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-xl">
      <Controller
        control={control}
        name="image"
        render={({ field, fieldState }) => (
          <ImageDropzone
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Field label="Caption" error={errors.caption?.message}>
        {(a11y) => (
          <Textarea {...a11y} placeholder="Create your caption" rows={4} {...register("caption")} />
        )}
      </Field>
      <Button type="submit" className="w-full" disabled={createPost.isPending}>
        {createPost.isPending ? "Sharing…" : "Share"}
      </Button>
    </form>
  );
}

interface ImageDropzoneProps {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  error?: string;
}

/** Figma "File Upload": Default / Error / Fill (preview + Change Image / Delete Image). */
function ImageDropzone({ value, onChange, error }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const preview = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const pick = () => inputRef.current?.click();
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col gap-xxs">
      <Label htmlFor="post-image">Photo</Label>
      <input
        ref={inputRef}
        id="post-image"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center gap-lg rounded-xl border border-dashed bg-neutral-950 px-3xl py-xl text-center",
          error ? "border-destructive" : dragging ? "border-primary-200" : "border-neutral-900",
        )}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img
              src={preview}
              alt="Selected"
              className="aspect-square w-full max-w-[404px] rounded-md object-cover"
            />
            <div className="flex flex-wrap justify-center gap-lg">
              <button
                type="button"
                onClick={pick}
                className="inline-flex h-10 cursor-pointer items-center gap-sm rounded-lg bg-neutral-900 px-lg text-sm font-medium tracking-minus-3 text-neutral-25"
              >
                <Icon name="arrow-up" className="size-5" /> Change Image
              </button>
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="inline-flex h-10 cursor-pointer items-center gap-sm rounded-lg bg-neutral-900 px-lg text-sm font-medium tracking-minus-3 text-destructive"
              >
                <Icon name="trash" className="size-5" /> Delete Image
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={pick}
            className="flex w-full cursor-pointer flex-col items-center gap-lg"
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-neutral-900 text-neutral-25">
              <Icon name="upload-cloud" className="size-5" />
            </span>
            <span className="flex flex-col gap-xs">
              <span className="text-sm text-neutral-600">
                <span className="font-semibold text-primary-200">Click to upload</span> or drag and
                drop
              </span>
              <span className="text-sm text-neutral-600">PNG or JPG (max. 5mb)</span>
            </span>
          </button>
        )}
      </div>
      {error && <p className="text-sm font-medium tracking-minus-3 text-destructive">{error}</p>}
    </div>
  );
}
