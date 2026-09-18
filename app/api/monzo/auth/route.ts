// app/api/monzo/auth/route.ts
export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.MONZO_CLIENT_ID!,
    redirect_uri: "http://localhost:3000/api/monzo/callback",
    response_type: "code",
    state: "localdev",
  });

  return Response.redirect(`https://auth.monzo.com/?${params.toString()}`);
}
