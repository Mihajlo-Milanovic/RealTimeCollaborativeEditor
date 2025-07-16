import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextResponse, NextRequest } from "next/server";

/**
 * @deprecated This function has been moved to the backend.
 * @param req
 * Safe to delete after verification.
 */

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    // samo gleda da li u bazi vec postoji user sa istim mailom...
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    console.log("user: ", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}