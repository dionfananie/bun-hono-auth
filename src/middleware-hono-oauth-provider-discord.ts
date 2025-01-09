import { Hono } from "hono";
import { discordAuth } from "@hono/oauth-providers/discord";

export const appAuthDiscord = new Hono();

appAuthDiscord.use(
  "/auth/discord",
  discordAuth({
    client_id: Bun.env.DISCORD_ID,
    client_secret: Bun.env.DISCORD_SECRET,
    scope: ["identify", "email"],
  })
);

appAuthDiscord.get("/auth/discord", (c) => {
  const token = c.get("token");
  const refreshToken = c.get("refresh-token");
  const grantedScopes = c.get("granted-scopes");
  const user = c.get("user-discord");

  return c.json({
    token,
    refreshToken,
    grantedScopes,
    user,
  });
});
