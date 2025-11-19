const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data.message) message = data.message;
    } catch {
      // kalau response bukan JSON, abaikan
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getEvents() {
    return request("/events", { method: "GET" });
  },

  getEvent(id) {
    return request(`/events/${id}`, { method: "GET" });
  },

  createEvent(payload) {
    return request("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateEvent(id, payload) {
    return request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteEvent(id) {
    return request(`/events/${id}`, {
      method: "DELETE",
    });
  },
};
