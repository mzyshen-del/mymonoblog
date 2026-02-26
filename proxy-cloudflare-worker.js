export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const upstreamBase = String(env.SUPABASE_URL || "");
    if (!upstreamBase.startsWith("https://")) {
      return new Response("SUPABASE_URL is invalid", { status: 500 });
    }

    const upstream = new URL(upstreamBase);

    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(
        JSON.stringify({ ok: true, proxy: "shenmu-supabase-proxy", upstream: upstream.origin }),
        {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": "*",
          },
        }
      );
    }

    // Only proxy Supabase Auth/REST endpoints
    if (!url.pathname.startsWith("/auth/v1/") && !url.pathname.startsWith("/rest/v1/")) {
      return new Response("Not Found", { status: 404 });
    }

    upstream.pathname = url.pathname;
    upstream.search = url.search;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, Prefer",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("apikey", env.SUPABASE_ANON_KEY);

    if (!headers.get("authorization")) {
      headers.set("authorization", `Bearer ${env.SUPABASE_ANON_KEY}`);
    }

    let resp;
    try {
      resp = await fetch(upstream.toString(), {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      });
    } catch (err) {
      return new Response(`Upstream fetch failed: ${err?.message || "unknown error"}`, {
        status: 502,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const out = new Response(resp.body, resp);
    out.headers.set("Access-Control-Allow-Origin", "*");
    out.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    out.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, Prefer");
    return out;
  },
};
