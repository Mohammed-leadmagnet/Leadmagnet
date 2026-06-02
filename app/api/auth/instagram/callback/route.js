import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("https://leadmagnetinc.com/instagram?error=no_code");
  }

  try {
    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = "https://leadmagnetinc.com/api/auth/instagram/callback";

    // Exchange code for token
    const tokenRes = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token");

    // Get user profile
    const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`);
    const profile = await profileRes.json();

    // Get user from Supabase
    const cookieHeader = request.headers.get("cookie") || "";
    const { data: { user } } = await supabase.auth.getUser(
      cookieHeader.match(/sb-access-token=([^;]+)/)?.[1] || ""
    );

    if (user) {
      await supabase.from("instagram_accounts").upsert({
        user_id: user.id,
        instagram_id: profile.id,
        name: profile.name,
        access_token: tokenData.access_token,
        connected_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    return NextResponse.redirect("https://leadmagnetinc.com/instagram?connected=true");
  } catch (error) {
    return NextResponse.redirect(`https://leadmagnetinc.com/instagram?error=${error.message}`);
  }
}