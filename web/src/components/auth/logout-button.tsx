import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { AuthContextValue, useAuth } from "~/hooks/AuthProvider";

interface LogoutButtonProps {
  logout: AuthContextValue["logout"] | null;
}

export function LogoutButton({ logout }: LogoutButtonProps) {
  const router = useRouter();
  const { session } = useAuth();
  const handleLogout = async () => {
    if (!logout) return;
    const result = await logout();
    if (!result.success) {
      console.error(result.message);
      return;
    }
    router.push("/login");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Log Out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Think of all the kittens that will cry if you leave.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
