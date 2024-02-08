import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: process.env.MAIL_DOMAIN as string,
    to: email,
    subject: "Confirm your email",
    html: `<p><a href=${confirmLink}>Click here</a> to confirm email.</p>`
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetPasswordLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: process.env.MAIL_DOMAIN as string,
    to: email,
    subject: "Reset your password",
    html: `<p><a href=${resetPasswordLink}>Click here</a> to reset password.</p>`
  })
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  await resend.emails.send({
    from: process.env.MAIL_DOMAIN as string,
    to: email,
    subject: "Two Factor Confirmation",
    html: `<p>Your 2FA code: ${token}</p>`
  })
}