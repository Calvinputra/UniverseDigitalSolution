import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function formatDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventsPage() {
  const navigate = useNavigate();
  const { isGuest, logout } = useAuth(); // <-- AMBIL logout

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.getEvents();
        console.log("RESPONSE BACKEND:", res);
        console.log("RAW JSON:", res.data || res);
        setEvents(res.data || res);
      } catch (err) {
        setError((err && err.message) || "Gagal memuat event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter((ev) => {
      const matchesSearch = !search || (ev.title && ev.title.toLowerCase().includes(search.toLowerCase())) || (ev.location && ev.location.toLowerCase().includes(search.toLowerCase()));

      let matchesUpcoming = true;
      if (upcomingOnly && ev.start_time) {
        matchesUpcoming = new Date(ev.start_time) >= now;
      }

      return matchesSearch && matchesUpcoming;
    });
  }, [events, upcomingOnly, search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 24px",
        width: "100vh",
        background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 960 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#e5e7eb",
            }}
          >
            Event Manager
          </h1>

          <div style={{ display: "flex", gap: 12 }}>
            {/* JIKA SUDAH LOGIN → tampilkan CREATE EVENT */}
            {!isGuest && (
              <Link to="/events/new">
                <button
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#60a5fa",
                    color: "#f9fafb",
                  }}
                >
                  + Create Event
                </button>
              </Link>
            )}

            {/* BUTTON LOGIN / LOGOUT */}
            {isGuest ? (
              // BELUM LOGIN → LOGIN BUTTON
              <Link to="/login">
                <button
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "1px solid #60a5fa",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "rgba(96,165,250,0.2)",
                    color: "#bfdbfe",
                  }}
                >
                  Login
                </button>
              </Link>
            ) : (
              // SUDAH LOGIN → LOGOUT BUTTON
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid #ef4444",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  background: "rgba(239,68,68,0.2)",
                  color: "#fca5a5",
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* BAR: UPCOMING + SEARCH */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            gap: 16,
          }}
        >
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 10,
              border: "1px solid #4b5563",
              backgroundColor: "rgba(15,23,42,0.8)",
              color: "#e5e7eb",
              fontSize: 13,
            }}
          >
            <input type="checkbox" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} style={{ accentColor: "#60a5fa" }} />
            Upcoming only
          </label>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              maxWidth: 280,
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #4b5563",
              backgroundColor: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: 13,
            }}
          />
        </div>

        {/* LOADING / ERROR */}
        {loading && <p style={{ color: "#9ca3af" }}>Memuat event...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {!loading && !error && filteredEvents.length === 0 && <p style={{ color: "#9ca3af" }}>Belum ada event.</p>}

        {/* EVENT LIST */}
        {filteredEvents.map((ev) => {
          console.log(ev);
          const attendees = ev.attendees_count ?? 0;
          const quota = ev.quota ?? null;

          const isFull = quota !== null && attendees >= quota;
          const remaining = quota !== null ? Math.max(quota - attendees, 0) : null;

          return (
            <div
              key={ev.id}
              style={{
                borderRadius: 18,
                padding: 20,
                marginBottom: 16,
                background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))",
                border: "1px solid rgba(55,65,81,0.8)",
                boxShadow: "0 18px 40px rgba(15,23,42,0.8)",
              }}
            >
              {/* TOP BAR */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#e5e7eb",
                      marginBottom: 4,
                    }}
                  >
                    {ev.title}
                  </h2>

                  {ev.description && <p style={{ color: "#9ca3af", fontSize: 13 }}>{ev.description}</p>}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/events/${ev.id}`}>
                    <button
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: "1px solid #4b5563",
                        backgroundColor: "#111827",
                        color: "#e5e7eb",
                        fontSize: 12,
                      }}
                    >
                      View Detail
                    </button>
                  </Link>

                  {quota !== null && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid #4b5563",
                        backgroundColor: isFull ? "rgba(248,113,113,0.15)" : "rgba(34,197,94,0.14)",
                        color: isFull ? "#fecaca" : "#bbf7d0",
                      }}
                    >
                      {isFull ? "FULL" : "OPEN"}
                    </span>
                  )}
                </div>
              </div>

              {/* DETAILS BOX */}
              <div
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid #374151",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderBottom: "1px solid #374151",
                    color: "#e5e7eb",
                  }}
                >
                  Date &amp; Time: {formatDateTime(ev.start_time)}
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    borderBottom: "1px solid #374151",
                    color: "#e5e7eb",
                  }}
                >
                  Location: {ev.location}
                </div>

                <div style={{ padding: "6px 10px", color: "#e5e7eb" }}>
                  Quota:{" "}
                  {quota !== null ? (
                    <>
                      {attendees} / {quota} ({isFull ? "Full" : `${remaining} seats left`})
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
