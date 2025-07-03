"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Sva polja su neophodna!");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("Korisnik sa ovim mailom već postoji!");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("Registracija nije uspela.");
      }
    } catch (error) {
      console.log("Greška prilikom registracije: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-[#1e293b] shadow-xl rounded-xl p-8 border border-[#334155]">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Napravi nalog
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Ime"
            className="px-4 py-3 rounded-md bg-[#0f172a] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
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
            Registruj se
          </button>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm py-2 px-4 rounded-md border border-red-400/30">
              {error}
            </div>
          )}

          <div className="text-sm text-center text-gray-400 mt-4">
            Već imate nalog?{" "}
            <Link href="/" className="text-blue-400 hover:underline">
              Prijavite se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}