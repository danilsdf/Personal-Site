import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message?: string };
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    await sendTelegramMessage(message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[telegram-notify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
