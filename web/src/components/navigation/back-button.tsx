import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="outline" size="icon" onClick={() => router.back()}>
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  );
}
