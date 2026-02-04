export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth/welcome.html";
    throw new Error("Unauthorized");
  }

  return response;
}
