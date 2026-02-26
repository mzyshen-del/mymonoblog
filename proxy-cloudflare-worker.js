export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const upstream = new URL(env.SUPABASE_URL);

    // Keep path/query: /auth/v1/* and /rest/v1/*
    upstream.pathname = url.pathname;
    upstream.search = url.search;

    const headers = new Headers(request.headers);
    headers.set("apikey", env.SUPABASE_ANON_KEY);

    // If client doesn't send Authorization, default to anon key.
    if (!headers.get("authorization")) {
      headers.set("authorization", `Bearer ${env.SUPABASE_ANON_KEY}`);
    }

    // Optional CORS for browser calls.
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, Prefer",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    const resp = await fetch(upstream.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    });

    const out = new Response(resp.body, resp);
    out.headers.set("Access-Control-Allow-Origin", "*");
    out.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    out.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, Prefer");
    return out;
  },
};
