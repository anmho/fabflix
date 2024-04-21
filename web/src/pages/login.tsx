// At the top of your file
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "~/utils/cn";
import { useRouter } from "next/router";
import { handleLogin } from "~/services/login";

const Login: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("email", emailInput);
    formData.append("password", passwordInput);

    await handleLogin(formData)
      .then(() => {
        router.push("/movies");
      })
      .catch((error) => {
        console.error("Login failed: ", error);
        alert("Login failed: " + error.message);
      });
  };

  return (
    <>
      <div className="py-[50px] md:py-[80px] lg:py-[100px] xl:py-[120px] lg:px-[15%] md:px-[5%] flex flex-wrap justify-center items-start gap-4 p-4">
        <div className="ml-2 md:ml-5 lg:ml-10 xl:ml-10">
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
              Welcome Back!
            </h2>
            <h1>
              jbrown@ics185.edu <br />
              keyboard
            </h1>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Login for seamless rentals, endless entertainment.
            </p>
            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email."
                  type="email"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />
              </LabelInputContainer>
              <button
                className="bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
                type="submit"
              >
                Log in &rarr;
              </button>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </form>
          </div>
        </div>
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

export default Login;
