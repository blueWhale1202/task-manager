import { Hono } from "hono";
import { handle } from "hono/vercel";

import { auth } from "@/features/auth/server/route";
import { workspace } from "@/features/workspace/server/route";
import { members } from "@/features/members/server/route";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
    .route("/auth", auth)
    .route("/members", members)
    .route("/workspace", workspace);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
