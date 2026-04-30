import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { NextResponse } from "next/server";

export async function getAdminPayload() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (payload.role !== "Admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
