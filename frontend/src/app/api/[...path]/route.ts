import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(request: NextRequest, { params }: RouteContext) {
  // Render injects BACKEND_HOSTPORT from the backend service. Local development
  // and Docker Compose instead provide BACKEND_URL. If the host-port value is not
  // available yet at runtime, the proxy falls back to the public backend URL.
  const backendHostPort = process.env.BACKEND_HOSTPORT?.trim();
  const backendUrlFromEnv = process.env.BACKEND_URL?.trim();
  const backendUrl = backendHostPort
    ? /^https?:\/\//i.test(backendHostPort)
      ? backendHostPort
      : `http://${backendHostPort}`
    : backendUrlFromEnv || (process.env.NODE_ENV === "production"
        ? "https://radiology-backend-fhal.onrender.com"
        : "");

  if (!backendUrl) {
    return Response.json({ detail: "Backend URL is not configured" }, { status: 503 });
  }

  const { path } = await params;
  const upstreamUrl = new URL(`/api/${path.map(encodeURIComponent).join("/")}`, backendUrl);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["accept", "authorization", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
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
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
