import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAdminPayload, adminUnauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await getAdminPayload())) return adminUnauthorized();
  try {
    const db = await getDb();
    const items = await db
      .collection("Ingredients")
      .find({})
      .sort({ name: 1 })
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
    if (!body.name?.trim())
      return NextResponse.json({ error: "Name is required." }, { status: 400 });

    const db = await getDb();
    const now = new Date();
    const doc = {
      name: body.name.trim(),
      brand: body.brand || null,
      category: body.category || null,
      nutritionBasis: body.nutritionBasis || "raw",
      kcalPer1g: Number(body.kcalPer1g) || 0,
      proteinPer1g: Number(body.proteinPer1g) || 0,
      carbsPer1g: Number(body.carbsPer1g) || 0,
      fatPer1g: Number(body.fatPer1g) || 0,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection("Ingredients").insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
