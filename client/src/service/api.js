const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options,
    });

    const data = await res.json().catch(() => ({ message: "Invalid JSON response" }));
    
    return { 
      ok: res.ok, 
      data,
      status: res.status
    };
  } catch (error) {
    console.error("API request error:", error);
    return {
      ok: false,
      data: { message: error.message || "Network error" },
      status: 0
    };
  }
}
