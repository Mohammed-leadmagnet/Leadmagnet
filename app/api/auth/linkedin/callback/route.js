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
    return NextResponse.redirect("https://leadmagnetinc.com/linkedin?error=no_code");
  }

  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = "https://leadmagnetinc.com/api/auth/linkedin/callback";

    // Exchange code for token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token");

    // Get LinkedIn profile
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    // Get user from Supabase session cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const { data: { user } } = await supabase.auth.getUser(
      cookieHeader.match(/sb-access-token=([^;]+)/)?.[1] || ""
    );

    if (user) {
      await supabase.from("linkedin_accounts").upsert({
        user_id: user.id,
        email: profile.email,
        name: profile.name,
        access_token: tokenData.access_token,
        connected_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    return NextResponse.redirect("https://leadmagnetinc.com/linkedin?connected=true");
  } catch (error) {
    return NextResponse.redirect(`https://leadmagnetinc.com/linkedin?error=${error.message}`);
  }
}
