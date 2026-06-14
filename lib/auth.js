import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Extract and verify the authenticated user from a request.
 * Reads the Supabase access token from the Authorization header or cookie.
 * Returns { user, error }.
 */
export async function getAuthUser(request) {
  try {
    // Try Authorization header first
    const authHeader = request.headers.get("authorization");
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }

    // Try cookie fallback
    if (!token) {
      const cookies = request.headers.get("cookie") || "";
      const match = cookies.match(/sb-[^=]+-auth-token=([^;]+)/);
      if (match) {
        try {
          const decoded = decodeURIComponent(match[1]);
          const parsed = JSON.parse(decoded);
          token = parsed?.access_token || parsed?.[0]?.access_token;
        } catch {
          // Cookie parse failed
        }
      }
    }

    if (!token) {
      return { user: null, error: "No authentication token found" };
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return { user: null, error: "Invalid or expired token" };
    }

    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: "Authentication failed: " + err.message };
  }
}

/**
 * Verify that a userId matches the authenticated user.
 * Prevents users from acting on behalf of other users.
 */
export async function verifyUserOwnership(request, claimedUserId) {
  const { user, error } = await getAuthUser(request);

  if (error || !user) {
    return { authorized: false, user: null, error: error || "Not authenticated" };
  }

  if (user.id !== claimedUserId) {
    return { authorized: false, user, error: "User ID mismatch — access denied" };
  }

  return { authorized: true, user, error: null };
}
