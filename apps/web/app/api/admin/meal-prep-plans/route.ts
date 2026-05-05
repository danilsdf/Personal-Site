import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAdminPayload, adminUnauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const db = await getDb();
    const items = await db
      .collection("MealPrepPlans")
      .find({})
      .sort({ startDate: -1 })
      .toArray();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const body = await req.json();
    if (!body.title?.trim())
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (!body.id?.trim())
      return NextResponse.json({ error: "ID (slug) is required." }, { status: 400 });

    const db = await getDb();
    const existing = await db.collection("MealPrepPlans").findOne({ id: body.id.trim() });
    if (existing)
      return NextResponse.json({ error: "ID already in use." }, { status: 409 });

    const now = new Date();
    const doc = {
      id: body.id.trim(),
      title: body.title.trim(),
      startDate: body.startDate || "",
      endDate: body.endDate || "",
      calories: Number(body.calories) || 0,
      protein: Number(body.protein) || 0,
      carbs: Number(body.carbs) || 0,
      fat: Number(body.fat) || 0,
      imageUrl: body.imageUrl || null,
      ingredientNames: Array.isArray(body.ingredientNames) ? body.ingredientNames : [],
      isCurrentWeek: body.isCurrentWeek ?? false,
      isActive: body.isActive ?? true,
      recipes: [],
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection("MealPrepPlans").insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
