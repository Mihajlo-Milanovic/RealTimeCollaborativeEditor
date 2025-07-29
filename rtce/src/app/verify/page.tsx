"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

let verifySent = false;

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  //const [verifySent, setVerifySent] = useState(false);

  // 2 puta salje zahtev ispraviti ovaj bug!!!
  useEffect(() => {
    if (!token) {
      setError("Nedostaje verifikacioni token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/user/getUserByVerificationToken?verificationToken=${token}`
        );

        if (!res.ok) {
          setError("Nevalidan ili istekao token za verifikaciju.");
          return;
        }

        const verifyRes = await fetch(
          `http://localhost:5000/user/verifyUser?verificationToken=${token}`
        );

        if (verifyRes.ok) {
          router.push("/verify/success");
        } else {
          console.log("OPREMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
          setError("Došlo je do greške prilikom verifikacije.");
        }
      } catch (e) {
        setError("Greška u komunikaciji sa serverom.");
        console.error(e);
      }
    };
    if (!verifySent) {
      verify();
      verifySent = true;
    }
  }, [token]);

  if (error) {
    return <p>{error}</p>;
  }

  return <p>Verifikujem vaš nalog...</p>;
}