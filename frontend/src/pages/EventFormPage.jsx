import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function EventFormPage() {
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    quota: "",
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isGuest) {
    navigate("/login", {
      state: { message: "Silakan login terlebih dahulu untuk membuat event." },
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      quota: form.quota ? Number(form.quota) : null,
    };

    try {
      await api.createEvent(payload); 
      navigate("/events");
    } catch (err) {
      setError(err.message || "Gagal membuat event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundImage: "repeating-linear-gradient(0deg, #0f172a 0, #0f172a 1px, #020617 1px, #020617 24px), repeating-linear-gradient(90deg, #0f172a 0, #0f172a 1px, #020617 1px, #020617 24px)",
          borderRadius: 16,
          border: "1px solid #1f2937",
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            borderBottom: "1px solid #4b5563",
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#020617",
              color: "#e5e7eb",
              fontWeight: 600,
            }}
          >
            Event Manager
          </div>

          <Link
            to="/events"
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              color: "#e5e7eb",
              textDecoration: "none",
            }}
          >
            Back to List
          </Link>
        </div>

        <div
          style={{
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            padding: 16,
            background: "rgba(15,23,42,0.9)",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              marginBottom: 14,
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            Create New Event
          </div>

          {error && <p style={{ color: "#fecaca" }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb" }}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb" }}>Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb" }}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb" }}>Quota</label>
              <input
                name="quota"
                type="number"
                min="1"
                value={form.quota}
                onChange={handleChange}
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ color: "#e5e7eb" }}>Start time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    padding: "8px 10px",
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ color: "#e5e7eb" }}>End time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    padding: "8px 10px",
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              style={{
                marginTop: 10,
                padding: "9px 18px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#111827",
                color: "#e5e7eb",
              }}
            >
              {loading ? "Membuat..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
