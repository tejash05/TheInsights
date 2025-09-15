// lib/apiClient.ts
export async function apiFetch(path: string, options: RequestInit = {}, tenantId?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Append tenantId automatically if provided
  let url = `${baseUrl}${path}`;
  if (tenantId) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}tenantId=${tenantId}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
