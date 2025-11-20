import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isGuest } = useAuth(); // <— ambil status guest

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.getEvents();
        setEvents(res.data || res);
      } catch (err) {
        setError(err.message || "Gagal memuat event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 className="title">Event Manager</h1>

        {/* hanya tampil kalau BUKAN guest */}
        {!isGuest && (
          <Link to="/events/new">
            <button
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: "#3b82f6",
                color: "#f9fafb",
              }}
            >
              + Create Event
            </button>
          </Link>
        )}
      </div>

      {loading && <p>Memuat event...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && events.length === 0 && <p>Belum ada event.</p>}

      {events.map((ev) => {
        const isFull = typeof ev.attendees_count === "number" && typeof ev.quota === "number" && ev.attendees_count >= ev.quota;

        const remaining = typeof ev.attendees_count === "number" && typeof ev.quota === "number" ? ev.quota - ev.attendees_count : null;

        return (
          <div
            key={ev.id}
            className="event-card"
            style={{
              border: "1px solid #1f2937",
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
            }}
          >
            <h2>{ev.title}</h2>
            <p>{ev.description}</p>
            <p>Date &amp; Time: {ev.start_time}</p>
            <p>Location: {ev.location}</p>
            <p>
              Quota: {ev.attendees_count} / {ev.quota}{" "}
              {ev.quota != null && (
                <>
                  {"("}
                  {isFull ? "Full" : `${remaining} seats left`}
                  {")"}
                </>
              )}
            </p>

            <Link to={`/events/${ev.id}`}>
              <button className="btn btn-right">View Detail</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
