"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // ni ovo ga ne ubrzava
  // useEffect(() => {
  //   router.prefetch("/register");
  // },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Nevalidni kredencijali!");
        setIsLoading(false);
        return;
      }

      const userRes = await fetch(`/api/user?email=${email}`);
      const userData = await userRes.json();

      if (!userData.verified) {
        setError("Niste verifikovali nalog!");
        setIsLoading(false);
        return;
      }

      router.replace("editor");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-[#0f172a] px-4">
    <div className="w-full max-w-md bg-[#1e293b] shadow-xl rounded-xl p-8 border border-[#334155]">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-white mb-6 text-center">
            Ulogujte se
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="px-4 py-3 rounded-md bg-[#0f172a] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Šifra"
              className="px-4 py-3 rounded-md bg-[#0f172a] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
            >
              Prijavi se
            </button>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm py-2 px-4 rounded-md border border-red-400/30">
                {error}
              </div>
            )}

            <div className="text-sm text-center text-gray-400 mt-4">
              Nemate nalog?{" "}
              <Link href="/register" prefetch={true} className="text-blue-400 hover:underline">
                Registrujte se
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  </div>
);
}