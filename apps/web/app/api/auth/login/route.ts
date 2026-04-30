import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db
      .collection("Users")
      .findOne({ email: email.toLowerCase() });

    // Use constant-time comparison — always run verifyPassword to prevent timing attacks
    const dummyHash =
      "$2a$12$invalidhashusedtopreventtimingattacks.invalidsalt.invalid";
    const passwordMatch = user
      ? await verifyPassword(password, user.passwordHash)
      : await verifyPassword(password, dummyHash).then(() => false);

    if (!user || !passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toHexString(),
      email: user.email,
      role: user.role as "Admin" | "User",
    });

    const response = NextResponse.json(
      {
        message: "Logged in successfully.",
        user: { fullName: user.fullName, email: user.email, role: user.role },
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
