import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api/client";

export function EventFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    quota: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const fetchEvent = async () => {
      setInitialLoading(true);
      setError("");
      try {
        const res = await api.getEvent(id);
        const ev = res.data || {};
        setForm({
          title: ev.title || "",
          description: ev.description || "",
          location: ev.location || "",
          quota: ev.quota ?? "",
          start_time: ev.start_time || "",
          end_time: ev.end_time || "",
        });
      } catch (err) {
        setError(err.message || "Gagal memuat event");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEvent();
  }, [id, isEdit]);

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
      if (isEdit) {
        await api.updateEvent(id, payload);
      } else {
        await api.createEvent(payload);
      }
      navigate("/events");
    } catch (err) {
      setError(err.message || "Gagal menyimpan event");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <p style={{ padding: 24 }}>Memuat...</p>;
  }

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
          boxShadow: "0 18px 45px rgba(0,0,0,0.7)",
          padding: 20,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              fontSize: 14,
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
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 13,
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
              display: "inline-block",
              marginBottom: 14,
              fontSize: 14,
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            {isEdit ? "Edit Event" : "Form New Event"}
          </div>

          {error && <p style={{ color: "#fecaca", marginBottom: 10 }}>{error}</p>}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 640,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb", fontSize: 13 }}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  fontSize: 14,
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb", fontSize: 13 }}>Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  fontSize: 14,
                  background: "#020617",
                  color: "#e5e7eb",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb", fontSize: 13 }}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                style={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 10px",
                  fontSize: 14,
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#e5e7eb", fontSize: 13 }}>Quota</label>
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
                  fontSize: 14,
                  background: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ color: "#e5e7eb", fontSize: 13 }}>Start time</label>
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
                    fontSize: 14,
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ color: "#e5e7eb", fontSize: 13 }}>End time</label>
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
                    fontSize: 14,
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <button
                disabled={loading}
                type="submit"
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1px solid #e5e7eb",
                  background: "#111827",
                  color: "#e5e7eb",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  minWidth: 120,
                }}
              >
                {loading ? "Menyimpan..." : isEdit ? "Simpan Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
