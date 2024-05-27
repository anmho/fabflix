import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "~/utils/cn";
import { useRouter } from "next/router";
import { Loading } from "~/components/navigation/loading";
import { useAuth } from "~/hooks/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { LoginParams } from "~/api/auth";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { env } from "~/utils/env";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { on } from "events";

const LoginPage: React.FC = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { session, login } = useAuth();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password, recaptchaToken }: LoginParams) =>
      login({ email, password, recaptchaToken }),
  });

  if (session !== null) {
    router.push("/browse");
    return <Loading />;
  }

  if (loginMutation.isPending) return <Loading />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    if (!recaptchaToken) {
      setErrorMsg("Please complete the reCAPTCHA");
      return;
    }

    const result = await loginMutation.mutateAsync({
      email: emailInput,
      password: passwordInput,
      recaptchaToken,
    });
    console.log(result);

    if (result.success) {
      setErrorMsg("");
      await new Promise((resolve) => setTimeout(resolve, 0.5));
      window.location.href = "/browse";
      return;
    } else {
      setErrorMsg(result?.message || "Error login in");
    }
  };
  return (
    <>
      <div className="py-[50px] md:py-[80px] lg:py-[100px] xl:py-[120px] lg:px-[15%] md:px-[5%] flex flex-wrap justify-center items-start gap-4 p-4">
        <AuthCard
          onChangeEmail={setEmailInput}
          onChangeRecaptchaToken={setRecaptchaToken}
          onChangePassword={setPasswordInput}
          errorMsg={errorMsg}
          emailInput={emailInput}
          passwordInput={passwordInput}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

interface AuthCardProps {
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onChangeRecaptchaToken: (recaptchaToken: string | null) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errorMsg: string;
  emailInput: string;
  passwordInput: string;
}

function AuthCard({
  onChangeEmail,
  onChangePassword,
  onChangeRecaptchaToken,
  handleSubmit,
  errorMsg,
  emailInput,
  passwordInput,
}: AuthCardProps) {
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        theme,
        "ml-2 md:ml-5 lg:ml-10 xl:ml-10 border border-border rounded-xl"
      )}
    >
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome Back!
        </h2>

        {process.env.NODE_ENV === "development" && (
          <h1>
            jbrown@ics185.edu <br />
            keyboard
          </h1>
        )}

        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login for seamless rentals, endless entertainment.
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={emailInput}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="Enter your email."
              type="email"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={passwordInput}
              onChange={(e) => onChangePassword(e.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </LabelInputContainer>
          {errorMsg !== "" && (
            <div
              className="my-2 bg-red-100 w-full border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{errorMsg}</span>
            </div>
          )}
          <Button
            className={cn(
              theme,
              "bg-primary border border-border text-primary-foreground block w-full rounded-md h-10 font-medium"
            )}
            type="submit"
          >
            Log in &rarr;
          </Button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          {/* <GoogleReCaptcha onVerify={console.log} /> */}
          <ReCAPTCHA
            sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(token) => onChangeRecaptchaToken(token)}
          />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
