import { Spinner } from "@nextui-org/react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner color="danger" size="lg" />
    </div>
  );
}
