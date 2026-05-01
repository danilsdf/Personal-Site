import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json(null);
    const payload = verifyToken(token);
    return NextResponse.json({
      email: payload.email,
      role: payload.role,
      userId: payload.userId,
    });
  } catch {
    return NextResponse.json(null);
  }
}
