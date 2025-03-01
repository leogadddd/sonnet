"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
}

const Error = ({ error }: ErrorProps) => {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      {error?.message && (
        <p className="text-muted-foreground text-sm max-w-prose">{error.message}</p>
      )}
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );
};

export default Error;
