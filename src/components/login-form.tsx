"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { encodeJWT, setAuthCookie } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const CREDENTIALS = {
  admin: { password: "admin123", role: "admin" as const },
  operator: { password: "operator123", role: "operator" as const },
};

const schema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .refine((v) => v.trim().length > 0, "Tidak boleh spasi saja"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .refine((v) => v.trim().length > 0, "Tidak boleh spasi saja"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    setAuthError(null);
    const cred = CREDENTIALS[values.username as keyof typeof CREDENTIALS];

    if (!cred || cred.password !== values.password) {
      setAuthError("Username atau password salah");
      return;
    }

    const token = encodeJWT({ username: values.username, role: cred.role });
    setAuthCookie(token);
    router.push("/dashboard");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your username and password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin / operator"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
