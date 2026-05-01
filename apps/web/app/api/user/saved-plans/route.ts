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

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const db = await getDb();

  const saved = await db
    .collection("SavedMealPrepPlans")
    .aggregate([
      { $match: { userId: user.userId } },
      { $sort: { savedAt: -1 } },
      {
        $lookup: {
          from: "MealPrepPlans",
          localField: "planId",
          foreignField: "id",
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 0,
          savedAt: 1,
          "plan.id": 1,
          "plan.title": 1,
          "plan.imageUrl": 1,
          "plan.calories": 1,
          "plan.protein": 1,
          "plan.fat": 1,
          "plan.carbs": 1,
          "plan.startDate": 1,
          "plan.endDate": 1,
          "plan.isCurrentWeek": 1,
        },
      },
    ])
    .toArray();

  return NextResponse.json(saved);
}
