// this file is using google auth manually. so the code still created manually not using middleware from package hono oauth
import { Hono } from "hono";

import fetch from "node-fetch";
export const authGoogle = new Hono();

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

authGoogle.get("/login", (ctx) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;

  return ctx.redirect(authUrl);
});
// Step 2: Callback Route

authGoogle.get("/auth/callback", async (ctx) => {
  const code = ctx.req.query("code");
  console.log(code);

  if (!code) {
    return ctx.text("Authorization code is missing", 400);
  }

  try {
    // Exchange authorization code for an access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "authGooglelication/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange authorization code for token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData as GoogleTokenResponse;

    // Use access token to fetch user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user information");
    }

    const user = await userResponse.json();

    return ctx.json({ message: "Login Successful", user });
  } catch (error) {
    console.error("OAuth2 Error:", error.message);
    return ctx.text("Authentication failed", 500);
  }
});
// Optional: Home route
authGoogle.get("/", (ctx) => ctx.text("Welcome to Google OAuth2 with Hono!"));
