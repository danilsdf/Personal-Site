import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json(null);
    const payload = verifyToken(token);

    const db = await getDb();
    const user = await db
      .collection("Users")
      .findOne({ email: payload.email }, { projection: { membership: 1 } });

    const membership = user?.membership ?? null;

    return NextResponse.json({
      email: payload.email,
      role: payload.role,
      userId: payload.userId,
      membership,
    });
  } catch {
    return NextResponse.json(null);
  }
}
