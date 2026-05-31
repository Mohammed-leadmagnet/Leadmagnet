import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const { action, userId } = await request.json();

    if (action === "fetch_posts") {
      // Get user's LinkedIn cookie
      const { data: account } = await supabase
        .from("linkedin_accounts")
        .select("session_cookie")
        .eq("user_id", userId)
        .single();

      if (!account) return NextResponse.json({ error: "LinkedIn not connected" }, { status: 400 });

      // Call Phantombuster to fetch recent posts
      const pbResponse = await fetch("https://api.phantombuster.com/api/v2/agents/launch", {
        method: "POST",
        headers: {
          "X-Phantombuster-Key": process.env.PHANTOMBUSTER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "YOUR_FETCH_POSTS_PHANTOM_ID",
          argument: {
            sessionCookie: account.session_cookie,
            numberOfPosts: 10,
          },
        }),
      });

      const pbData = await pbResponse.json();
      return NextResponse.json({ success: true, data: pbData });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}