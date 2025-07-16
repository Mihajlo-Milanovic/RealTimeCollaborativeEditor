import { connectMongoDB } from "../../../../lib/mongodb"
import User from "../../../../models/user";
import { NextResponse } from "next/server";

/**
 * @deprecated This function has been moved to the backend.
 * @param req
 * Safe to delete after verification.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  await connectMongoDB();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ verified: user.verified });
}
