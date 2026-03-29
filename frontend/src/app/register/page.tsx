"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {postRequest} from "@/app/api/serverRequests/methods"
import {Eye, EyeClosed} from "lucide-react";


export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{10,}$/;
    //(?=.*[A-Z]) – bar jedno veliko slovo
    //(?=.*\d) – bar jedan broj
    //(?=.*[^A-Za-z\d]) – bar jedan specijalni karakter
    // {10,} – najmanje 10 karaktera
    
    if (!passwordRegex.test(password)) {
      setError("The password must be at least 10 characters long and include one uppercase letter, one number, and one special character.");
      setIsLoading(false);
      return;
    }

try {
  const data = {
    username: name,
    email,
    password,
  };

  //nova ruta
  const res = await postRequest("users", data);
  const ans = await res.json();
  const ansUser = ans?.data;
  console.log(ansUser);

  if (!res.ok) {
    setIsLoading(false);
    setError(ansUser?.message ?? "Account registration failed.");
    return;
  }

  // const rootDirData = {
  //   name: `${ansUser.username}'s root directory`,
  //   owner: ansUser.id,
  //   parents: [], // neka ga
  //   children: [],
  //   files: [],
  //   //collaborators: [],
  // };
  //
  // //
  // const userRootDirectory = await postRequest("directories/create", rootDirData);
  // const ansRootDir = await userRootDirectory.json(); //
  //
  // if (userRootDirectory.ok) {
  //   console.log("Registracija uspela.");
  //   (e.target as HTMLFormElement).reset();
  //   router.push("/");
  // } else {
  //   setIsLoading(false);
  //   setError((ansRootDir?.message ?? "Greška pri kreiranju root direktorijuma. ->" + ansRootDir?.message));
  // }
} catch (error) {
      console.log("Error during an account registration: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-slate-950 via-slate-500 to-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-950/60 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-slate-700/50">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 animate-pulse">Your account is being created...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Create an account
              </h1>
              <p className="text-slate-400">Collaborate with ease</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="jovan_jovanovic"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required={true}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">E-mail</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required={true}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required={true}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowPassword( !showPassword )}
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Repeat password</label>
                <div className="relative">
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required={true}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200 active:scale-[0.98]"
              >
                Register
              </button>

              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm py-3 px-4 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <div className="text-sm text-center text-slate-400 mt-2">
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Already have an account?{" "}
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}