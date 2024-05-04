import React, { useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "~/components/navigation/loading";
import { Button } from "~/components/ui/button";
import { useTheme } from "next-themes";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/AuthProvider";
import { cn } from "~/utils/cn";

const EmployeeLoginPage: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { session, handleEmployeeLogin } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  if (session && session.userType === "employee") {
    router.push("/_dashboard");
    return <Loading />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await handleEmployeeLogin(emailInput, passwordInput);
      if (!result.success) {
        setErrorMsg(result.message || "Login Error");
      } else {
        router.push("/_dashboard");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className={cn(theme, "mx-auto px-4 container")}>
      <AuthCard
        onChangeEmail={setEmailInput}
        onChangePassword={setPasswordInput}
        errorMsg={errorMsg}
        emailInput={emailInput}
        passwordInput={passwordInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

interface AuthCardProps {
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errorMsg: string;
  emailInput: string;
  passwordInput: string;
}

const AuthCard: React.FC<AuthCardProps> = ({
  onChangeEmail,
  onChangePassword,
  handleSubmit,
  errorMsg,
  emailInput,
  passwordInput,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        theme,
        "max-w-md mx-auto my-10 bg-white dark:bg-black shadow-md rounded-xl p-8"
      )}
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome Back!
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
        Login for seamless access to employee tools.
      </p>
      <form onSubmit={handleSubmit} className="my-8">
        <LabelInputContainer
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={onChangeEmail}
        />
        <LabelInputContainer
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={passwordInput}
          onChange={onChangePassword}
        />
        {errorMsg && (
          <div
            className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded relative my-2"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
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
          Sign In &rarr;
        </Button>
      </form>
    </div>
  );
};

const LabelInputContainer = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full mb-4">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <Input
        id={label.toLowerCase()}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default EmployeeLoginPage;
