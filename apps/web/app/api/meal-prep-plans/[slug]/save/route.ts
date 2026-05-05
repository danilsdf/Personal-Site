import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// GET /api/meal-prep-plans/[slug]/save — check if saved
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ saved: false });

  const { slug } = await params;
  const db = await getDb();
  const exists = await db
    .collection("SavedMealPrepPlans")
    .findOne({ userId: user.userId, planId: slug });

  return NextResponse.json({ saved: !!exists });
}

// POST /api/meal-prep-plans/[slug]/save — save plan
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { slug } = await params;
  const db = await getDb();

  await db.collection("SavedMealPrepPlans").updateOne(
    { userId: user.userId, planId: slug },
    { $setOnInsert: { userId: user.userId, planId: slug, savedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ saved: true });
}

// DELETE /api/meal-prep-plans/[slug]/save — unsave plan
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { slug } = await params;
  const db = await getDb();

  await db
    .collection("SavedMealPrepPlans")
    .deleteOne({ userId: user.userId, planId: slug });

  return NextResponse.json({ saved: false });
}
