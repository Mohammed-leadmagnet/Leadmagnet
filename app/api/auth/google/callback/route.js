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
    return NextResponse.redirect("https://leadmagnetinc.com/gmail?error=no_code");
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = "https://leadmagnetinc.com/api/auth/google/callback";

    // Exchange code for token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token");

    // Get user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    // Find user by email in Supabase
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === profile.email);

    if (user) {
      await supabase.from("gmail_accounts").upsert({
        user_id: user.id,
        email: profile.email,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
      }, { onConflict: "user_id" });
    }

    return NextResponse.redirect("https://leadmagnetinc.com/gmail?connected=true");
  } catch (error) {
    return NextResponse.redirect(`https://leadmagnetinc.com/gmail?error=${error.message}`);
  }
}