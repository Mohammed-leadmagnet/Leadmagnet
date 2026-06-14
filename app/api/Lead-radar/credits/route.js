import { NextResponse } from "next/server";
import { hasScaleAccess, getLeadRadarCredits } from "@/lib/subscription";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    const credits = await getLeadRadarCredits(userId);

    return NextResponse.json({ credits });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
