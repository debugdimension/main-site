interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { username, accessKey } = await request.json() as { username: string, accessKey: string };

    if (!username || !accessKey) {
      return new Response(JSON.stringify({ error: "Missing username or accessKey" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // In a real scenario, we'd hash the accessKey and compare it with password_hash in D1.
    // For this initialization, we'll check if the user exists.
    const user = await env.DB.prepare("SELECT * FROM admin_users WHERE username = ? AND password_hash = ?")
      .bind(username, accessKey)
      .first();

    if (user) {
      // Mock session token
      const token = btoa(JSON.stringify({ username, expiry: Date.now() + 3600000 }));
      return new Response(JSON.stringify({ success: true, token }), {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Strict`,
        },
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
