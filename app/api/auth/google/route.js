import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = "https://leadmagnetinc.com/api/auth/google/callback";
  const scope = encodeURIComponent("email profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly");

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(url);
}