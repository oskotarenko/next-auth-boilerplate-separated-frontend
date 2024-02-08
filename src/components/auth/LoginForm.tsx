'use client'

import * as z from "zod";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginScheme } from "@/schemes";
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
import { login } from "@/actions/auth.actions";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email is already in use with different provider"
    : ""
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startPending] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginScheme>>({
    resolver: zodResolver(LoginScheme),
    defaultValues: {
      email: "",
      password: "",
      code: ""
    }
  });

  const onSubmit = (values: z.infer<typeof LoginScheme>) => {
    setError("");
    setSuccess("");

    startPending(async () => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  }

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel={!showTwoFactor ? "Don't have an account?" : ""}
      backButtonHref="/auth/register"
      showSocial={!showTwoFactor}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {
            !showTwoFactor &&
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john.doe@mail.com" type="email" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="********" type="password" disabled={isPending} />
                    </FormControl>
                    <Button size="sm" variant="link" asChild className="px-0 font-normal">
                      <Link href="/auth/reset">
                        Forgot password?
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          }
          {
            showTwoFactor &&
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123456" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}