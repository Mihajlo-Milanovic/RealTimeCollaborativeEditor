"use client";

import { useRouter } from "next/navigation";

export default function VerifySuccessPage() {
  const router = useRouter();

  return <p className="flex flex-col items-center justify-center h-screen">
      Your account is verified.
      <span className="text-blue-500 hover:underline"
        onClick={() => router.replace("/login")}
      >
          Log in
      </span>
    </p>
}
