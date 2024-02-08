"use client"

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./CardWrapper";
import { validate as validateUUID } from "uuid";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { newVerification } from "@/actions/auth.actions";
import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";


export function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const token = useSearchParams().get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token");
      return;
    }

    const isUUID = validateUUID(token);

    if (!isUUID) {
      setError("Invalid token");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error)
      })
      .catch(() => {
        setError("Something went wrong")
      })
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit])

  return (
    <CardWrapper headerLabel="Your email confirmed!" backButtonLabel="Login in your account" backButtonHref="/auth/login" >
      <div className="flex justify-center items-center w-full">
        {
          !success && !error && <BeatLoader />
        }
        {
          // ? For a valid token, the error "Token does not exist" may occur, 
          // ? which is associated with the double execution of useEffect in development mode
        }
        {
          !error && <FormSuccess message={success} />
        }
        <FormError message={error} />


      </div>
    </CardWrapper>
  )
}