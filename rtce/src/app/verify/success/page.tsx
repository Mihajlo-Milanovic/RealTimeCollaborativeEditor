"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifySuccessPage() {
  const router = useRouter();

  useEffect(() => {
    alert("Email je uspešno verifikovan! Možete se sada prijaviti.");
    router.push("/"); // ili "/login" ako koristiš tu rutu
  }, []);

  return null; // Ne moraš da prikazuješ ništa
}
