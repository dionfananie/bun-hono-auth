import { Hono } from "hono";
import { googleAuth } from "@hono/oauth-providers/google";
export const appAuthGoogle = new Hono();

appAuthGoogle.use(
  "/auth/google/",
  googleAuth({
    client_id: Bun.env.GOOGLE_CLIENT_ID,
    client_secret: Bun.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid", "email", "profile"],
  })
);

appAuthGoogle.get("/", (c) => c.text("hello from honso"));

appAuthGoogle.get("/auth/google/", (c) => {
  const token = c.get("token");
  const grantedScopes = c.get("granted-scopes");
  const user = c.get("user-google");

  return c.json({
    token,
    grantedScopes,
    user,
  });
});
