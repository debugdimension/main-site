export const onRequest: PagesFunction = async () => {
  return new Response(JSON.stringify({ status: "ACTIVE_SYNC" }), {
    headers: { "Content-Type": "application/json" },
  });
};
