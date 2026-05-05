import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hashPassword, signToken } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/telegram";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body as {
      fullName?: string;
      email?: string;
      password?: string;
    };

    // --- Validation ---
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("Users");

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await users.insertOne({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role: "User",
      createdAt: new Date(),
    });

    const token = signToken({
      userId: result.insertedId.toHexString(),
      email: email.toLowerCase(),
      role: "User",
    });

    const response = NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    sendTelegramMessage(
      `🆕 <b>New sign-up</b>\n👤 ${fullName.trim()} (${email.toLowerCase()})\n🕐 ${new Date().toUTCString()}`
    ).catch((err) => console.error("[telegram] notification error:", err));

    return response;
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
