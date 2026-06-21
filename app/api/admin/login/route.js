import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "leadmagnet_admin_session";

function signSession(username, expiresAt) {
  const secret = process.env.ADMIN_SESSION_SECRET || "";

  return crypto
    .createHmac("sha256", secret)
    .update(`${username}|${expiresAt}`)
    .digest("hex");
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminUsername || !adminPassword || !sessionSecret) {
      return NextResponse.json(
        { error: "Admin environment variables are missing." },
        { status: 500 }
      );
    }

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid admin login." },
        { status: 401 }
      );
    }

    const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
    const signature = signSession(username, expiresAt);

    const token = `${encodeURIComponent(username)}|${expiresAt}|${signature}`;

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.ADMIN_COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Could not log in." },
      { status: 500 }
    );
  }
}