"use client"

import { updateSettings } from "@/actions/settings.actions";
import { SettingsScheme } from "@/schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardWrapper } from "../auth/CardWrapper";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "../ui/switch";


export default function SettingsForm() {
  const { data, update: updateSession } = useSession();
  const [isPending, startPending] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof SettingsScheme>>({
    resolver: zodResolver(SettingsScheme),
    defaultValues: {
      name: data?.user.name || undefined,
      email: data?.user.email || undefined,
      isTwoFactorEnabled: data?.user.isTwoFactorEnabled || undefined
    }
  });

  const onSubmit = (values: z.infer<typeof SettingsScheme>) => {

    setSuccess("");
    setError("");

    startPending(() => {
      updateSettings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            updateSession();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Somenting went wrong"));
    })
  }

  return (
    <CardWrapper headerLabel="Settings" backButtonHref="/client" backButtonLabel="Visit client page">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" type="text" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {
            data?.user.isOAuth === false && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" type="text" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          }
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {
            data?.user.isOAuth === false && (
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factro Authentification</FormLabel>
                      <FormDescription>Enable 2FA for your account</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          }

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Save new settings
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}