import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../../../lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    await connectMongoDB();
    await User.create({ name, email, password: hashedPassword, verificationToken: verificationToken });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Greška pri registraciji:", error);
      return NextResponse.json(
        { message: "An error occurred while registering the user." },
        { status: 500 }
    );
  }
}