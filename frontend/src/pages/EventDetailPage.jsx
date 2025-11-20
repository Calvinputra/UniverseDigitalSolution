import { useEffect, useState, useMemo } from "react";
import { api } from "../api/client";
import { useParams, Link, useNavigate } from "react-router-dom";

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

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [eventRes, attRes] = await Promise.all([api.getEvent(id), api.getAttendances(id)]);

        const eventData = eventRes.data || eventRes;
        const attData = attRes.data || attRes;

        console.log("EVENT DATA:", eventData);
        console.log("EVENT ATTENDEES:", attData);

        setEvent(eventData);
        setAttendances(Array.isArray(attData) ? attData : []);
      } catch (err) {
        setError((err && err.message) || "Gagal memuat event");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);


  const dateTimeText = useMemo(() => {
    if (!event) return "-";
    const start = formatDateTime(event.start_time);
    const end = event.end_time ? formatDateTime(event.end_time) : null;

    if (end && start.slice(0, 11) === end.slice(0, 11)) {
      // kalau tanggal sama, tampilkan "12 Jan 2026, 19:00 - 21:00"
      return `${start} - ${end.slice(-5)}`;
    }

    return end ? `${start} → ${end}` : start;
  }, [event]);

  const quota = event && typeof event.quota === "number" ? event.quota : null;
  const attendees = attendances.length; 
  const isFull = quota !== null && attendees >= quota;

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError("");
  setSubmitMessage("");

  if (isFull) {
    setSubmitError("Event sudah penuh, tidak bisa mendaftar lagi.");
    return;
  }

  if (!fullName.trim() || !email.trim()) {
    setSubmitError("Nama dan email wajib diisi.");
    return;
  }

  setSubmitLoading(true);
  try {
    const res = await api.attendEvent(id, { full_name: fullName, email });

    const newAtt = res.data ?? res;

    setAttendances((prev) => [...prev, newAtt]);

    setSubmitMessage("Berhasil register ke event ini.");
    setFullName("");
    setEmail("");
  } catch (err) {
    setSubmitError(err?.message || "Gagal mendaftar ke event. Coba lagi.");
  } finally {
    setSubmitLoading(false);
  }
};

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 32,
          background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
          color: "#e5e7eb",
        }}
      >
        Memuat...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 32,
          background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
          color: "#f87171",
        }}
      >
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 32,
          background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
          color: "#e5e7eb",
        }}
      >
        Event tidak ditemukan.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 24px",
        background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100 }}>
        {/* HEADER ATAS: TITLE + BACK BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#e5e7eb",
            }}
          >
            Event Manager
          </h1>

          <button
            onClick={() => navigate("/events")}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid #4b5563",
              backgroundColor: "#111827",
              color: "#e5e7eb",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Back to List
          </button>
        </div>

        {/* 2 KOLUM: DETAIL KIRI, FORM KANAN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
            gap: 24,
          }}
        >
          {/* KIRI: DETAIL EVENT */}
          <div>
            {/* Judul Event */}
            <div
              style={{
                borderRadius: 12,
                border: "1px solid #4b5563",
                padding: "14px 16px",
                marginBottom: 12,
                backgroundColor: "rgba(15,23,42,0.9)",
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#e5e7eb",
                  margin: 0,
                }}
              >
                {event.title}
              </h2>
            </div>

            {/* Date/Location/Quota + OPEN badge */}
            <div
              style={{
                borderRadius: 12,
                border: "1px solid #4b5563",
                padding: 0,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              {/* Bar atas: Date & Time + badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid #374151",
                    padding: "8px 10px",
                    color: "#e5e7eb",
                    fontSize: 13,
                    backgroundColor: "#111827",
                  }}
                >
                  Date &amp; Time: {dateTimeText}
                </div>

                <div
                  style={{
                    padding: "8px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    borderLeft: "1px solid #374151",
                    backgroundColor: isFull ? "rgba(248,113,113,0.2)" : "rgba(34,197,94,0.2)",
                    color: isFull ? "#fecaca" : "#bbf7d0",
                  }}
                >
                  {isFull ? "FULL" : "OPEN"}
                </div>
              </div>

              <div
                style={{
                  padding: "6px 10px",
                  borderTop: "1px solid #374151",
                  borderBottom: "1px solid #374151",
                  fontSize: 13,
                  color: "#e5e7eb",
                  backgroundColor: "rgba(15,23,42,0.95)",
                }}
              >
                Location: {event.location || "-"}
              </div>

              <div
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  color: "#e5e7eb",
                  backgroundColor: "rgba(15,23,42,0.95)",
                }}
              >
                Quota:{" "}
                {quota !== null ? (
                  <>
                    {attendees} / {quota} ({isFull ? "Full" : `${Math.max(quota - attendees, 0)} seats left`})
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>

            {/* Description box */}
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: "4px 8px",
                  border: "1px solid #4b5563",
                  borderRadius: 8,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottom: "none",
                  fontSize: 13,
                  color: "#e5e7eb",
                  backgroundColor: "#111827",
                }}
              >
                Description:
              </div>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #4b5563",
                  borderRadius: 8,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  minHeight: 80,
                  fontSize: 13,
                  color: "#e5e7eb",
                  backgroundColor: "rgba(15,23,42,0.95)",
                }}
              >
                {event.description || "No description."}
              </div>
            </div>

            {/* Attendees list */}
            <div>
              <div
                style={{
                  padding: "4px 8px",
                  border: "1px solid #4b5563",
                  borderRadius: 8,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottom: "none",
                  fontSize: 13,
                  color: "#e5e7eb",
                  backgroundColor: "#111827",
                }}
              >
                Attendees ({attendees})
              </div>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #4b5563",
                  borderRadius: 8,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  minHeight: 120,
                  fontSize: 13,
                  color: "#e5e7eb",
                  backgroundColor: "rgba(15,23,42,0.95)",
                  whiteSpace: "pre-line",
                }}
              >
                {Array.isArray(attendances) && attendances.length > 0 ? (
                  attendances.map((a, idx) => (
                    <div key={idx}>
                      - {a.full_name} {a.email ? `(${a.email})` : ""}
                    </div>
                  ))
                ) : (
                  <span>Belum ada daftar nama yang ditampilkan.</span>
                )}
              </div>
            </div>
          </div>

          {/* KANAN: FORM REGISTER */}
          <div>
            <div
              style={{
                borderRadius: 16,
                border: "1px solid #4b5563",
                backgroundColor: "rgba(15,23,42,0.95)",
                padding: 16,
              }}
            >
              <div
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid #4b5563",
                  fontSize: 13,
                  color: "#e5e7eb",
                  marginBottom: 12,
                  backgroundColor: "#111827",
                }}
              >
                Register to this Event
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#e5e7eb",
                      marginBottom: 4,
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #4b5563",
                      backgroundColor: "#020617",
                      color: "#e5e7eb",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#e5e7eb",
                      marginBottom: 4,
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #4b5563",
                      backgroundColor: "#020617",
                      color: "#e5e7eb",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading || isFull}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: 999,
                    border: "none",
                    cursor: submitLoading || isFull ? "not-allowed" : "pointer",
                    backgroundColor: isFull ? "#6b7280" : "#60a5fa",
                    color: "#f9fafb",
                    fontWeight: 600,
                    fontSize: 14,
                    opacity: submitLoading ? 0.7 : 1,
                    marginBottom: 12,
                  }}
                >
                  {isFull ? "Event Full" : submitLoading ? "Registering..." : "Register"}
                </button>
              </form>

              <div
                style={{
                  borderRadius: 8,
                  border: "1px solid #4b5563",
                  padding: "8px 10px",
                  minHeight: 46,
                  fontSize: 12,
                  color: submitError ? "#fecaca" : "#bbf7d0",
                  backgroundColor: "#020617",
                }}
              >
                {submitError && submitError}
                {submitMessage && submitMessage}
                {!submitError && !submitMessage && <span>[ Success / Error message will appear here ]</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
