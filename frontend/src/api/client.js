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

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) {
    data = await res.json();
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  login(payload) {
    return request("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload) {
    return request("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getEvents() {
    return request("/events");
  },

  getEvent(id) {
    return request(`/events/${id}`);
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

  attendEvent(id) {
    return request(`/events/${id}/attend`, {
      method: "POST",
    });
  },

  getAttendances(id) {
    return request(`/events/${id}/attendances`);
  },
};
