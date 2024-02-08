'use client'

import * as z from "zod";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordScheme } from "@/schemes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { newPassword, reset } from "@/actions/auth.actions";
import { useState, useTransition } from "react";
import { validate as validateUUID } from "uuid";
import { useSearchParams } from "next/navigation";

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")
  const [isPending, startPending] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof NewPasswordScheme>>({
    resolver: zodResolver(NewPasswordScheme),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (values: z.infer<typeof NewPasswordScheme>) => {

    setError("");
    setSuccess("");

    if (!token) return setError("Missing token");

    const isUUID = validateUUID(token);
    if (!isUUID) return setError("Invalid token");

    newPassword(values, token)
      .then(data => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => setError("Something went wrong"));
  }

  return (
    <CardWrapper headerLabel="Set new password" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="********" type="password" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="********" type="password" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !!success}
          >
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}