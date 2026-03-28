import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
      <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                  <p>
                      Your account is being verified...
                  </p>
              </div>
      }>
        <VerifyClient />
      </Suspense>
  );
}