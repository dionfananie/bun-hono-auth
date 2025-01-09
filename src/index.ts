import { Hono } from "hono";
import { appAuthGoogle } from "./middleware-hono-oauth-provider-google";
import { appAuthDiscord } from "./middleware-hono-oauth-provider-discord";

const app = new Hono().basePath("/api/v1");

app.route("/", appAuthGoogle);
app.route("/", appAuthDiscord);

export default app;
