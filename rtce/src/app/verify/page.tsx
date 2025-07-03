import { redirect } from "next/navigation";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export default async function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;

  if (!token) {
    return <p>Nedostaje verifikacioni token.</p>;
  }

  await connectMongoDB();

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return <p>Nevalidan ili istekao token za verifikaciju.</p>;
  }

  user.verified = true;
  user.verificationToken = undefined;
  await user.save();

  // Redirektuj na novu klijentsku komponentu koja prikazuje alert
  redirect("/verify/success");
}
