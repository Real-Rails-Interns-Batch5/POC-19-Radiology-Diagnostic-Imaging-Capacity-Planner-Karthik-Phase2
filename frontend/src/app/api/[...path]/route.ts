import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(request: NextRequest, { params }: RouteContext) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return Response.json({ detail: "BACKEND_URL is not configured" }, { status: 503 });
  }

  const { path } = await params;
  const upstreamUrl = new URL(`/api/${path.map(encodeURIComponent).join("/")}`, backendUrl);
  upstreamUrl.search = request.nextUrl.search;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: { accept: request.headers.get("accept") ?? "application/json" },
      cache: "no-store",
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Backend proxy request failed", { backendUrl, error });
    return Response.json({ detail: "Backend service is unavailable" }, { status: 502 });
  }
}

export const GET = proxy;
