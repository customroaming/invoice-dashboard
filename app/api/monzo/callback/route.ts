// app/api/monzo/callback/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return Response.json({ error: "No code" }, { status: 400 });

  const res = await fetch("https://api.monzo.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.MONZO_CLIENT_ID!,
      client_secret: process.env.MONZO_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/api/monzo/callback",
      code,
    }),
  });

  const data = await res.json();

  // Temporarily return the tokens so you can copy them
  return Response.json(data);
}
