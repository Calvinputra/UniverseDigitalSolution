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
  const { isGuest, logout } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // === FILTER & SORT STATE ===
  const [statusFilter, setStatusFilter] = useState("upcoming"); // "upcoming" | "past" | "all"
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("start_asc"); // "start_asc" | "start_desc" | "title_asc"

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.getEvents();
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

    const filtered = events.filter((ev) => {
      // FILTER SEARCH
      const matchesSearch = !search || (ev.title && ev.title.toLowerCase().includes(search.toLowerCase())) || (ev.location && ev.location.toLowerCase().includes(search.toLowerCase()));

      // FILTER STATUS (UPCOMING / PAST / ALL)
      let matchesStatus = true;
      if (ev.start_time) {
        const start = new Date(ev.start_time);

        if (statusFilter === "upcoming") {
          matchesStatus = start >= now;
        } else if (statusFilter === "past") {
          matchesStatus = start < now;
        } else {
          matchesStatus = true; // "all"
        }
      }

      return matchesSearch && matchesStatus;
    });

    // SORT
    const sorted = [...filtered].sort((a, b) => {
      const aStart = a.start_time ? new Date(a.start_time).getTime() : 0;
      const bStart = b.start_time ? new Date(b.start_time).getTime() : 0;

      if (sortBy === "start_asc") {
        return aStart - bStart;
      }
      if (sortBy === "start_desc") {
        return bStart - aStart;
      }
      if (sortBy === "title_asc") {
        const tA = (a.title || "").toLowerCase();
        const tB = (b.title || "").toLowerCase();
        if (tA < tB) return -1;
        if (tA > tB) return 1;
        return 0;
      }
      return 0;
    });

    return sorted;
  }, [events, statusFilter, search, sortBy]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 24px",
        width: "100vw",
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

            {isGuest ? (
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

        {/* FILTER BAR: TAB STATUS + SEARCH + SORT */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* TAB STATUS */}
          <div
            style={{
              display: "inline-flex",
              padding: 3,
              borderRadius: 999,
              border: "1px solid #4b5563",
              backgroundColor: "rgba(15,23,42,0.9)",
            }}
          >
            {[
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Selesai" },
              { id: "all", label: "Semua" },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: active ? "#60a5fa" : "transparent",
                    color: active ? "#0b1120" : "#e5e7eb",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari judul atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 160,
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #4b5563",
              backgroundColor: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: 13,
            }}
          />

          {/* SORT SELECT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #4b5563",
              backgroundColor: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: 13,
            }}
          >
            <option value="start_asc">Waktu mulai ↑</option>
            <option value="start_desc">Waktu mulai ↓</option>
            <option value="title_asc">Judul A–Z</option>
          </select>
        </div>

        {/* LOADING / ERROR */}
        {loading && <p style={{ color: "#9ca3af" }}>Memuat event...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {!loading && !error && filteredEvents.length === 0 && <p style={{ color: "#9ca3af" }}>Belum ada event.</p>}

        {/* EVENT LIST */}
        {filteredEvents.map((ev) => {
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
