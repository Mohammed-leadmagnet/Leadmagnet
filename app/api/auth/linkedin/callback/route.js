import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

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

    // Get user from cookies — try all possible Supabase cookie names
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map(c => {
        const [key, ...val] = c.trim().split("=");
        return [key, val.join("=")];
      })
    );

    // Try to find the Supabase access token in cookies
    let accessToken = null;
    for (const [key, value] of Object.entries(cookies)) {
      if (key.includes("access-token") || key.includes("access_token")) {
        accessToken = value;
        break;
      }
    }

    let userId = null;

    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      if (user) userId = user.id;
    }

    // Fallback: find user by LinkedIn email
    if (!userId && profile.email) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const matchedUser = users?.users?.find(u => u.email === profile.email);
      if (matchedUser) userId = matchedUser.id;
    }

    if (userId) {
      await supabase.from("linkedin_accounts").upsert({
        user_id: userId,
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