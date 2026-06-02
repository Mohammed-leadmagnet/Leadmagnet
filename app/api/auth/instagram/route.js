import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = "https://leadmagnetinc.com/api/auth/instagram/callback";
  const state = Math.random().toString(36).substring(7);

  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_profile&state=${state}&response_type=code`;

  return NextResponse.redirect(url);
}