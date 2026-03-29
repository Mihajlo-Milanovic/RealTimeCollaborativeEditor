import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(`Session: ${session}`)
  if (session) {
    console.log(`Session exists ${session}`)
    redirect("/editor");
  }
   else{
    console.log(`Session does not exist`)
    redirect("/login");
  }
}