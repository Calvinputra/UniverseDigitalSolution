import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.getEventById(id); 
        setEvent(res.data || res);
      } catch (err) {
        setError(err.message || "Gagal memuat detail event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setActionMsg("");
    try {
      await api.registerAttendance(id);
      setActionMsg("Berhasil mendaftar ke event ini.");
    } catch (err) {
      setActionMsg(err.message || "Gagal mendaftar ke event");
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="page-root">
        <div className="text-muted">Memuat detail event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-root">
        <div className="alert alert-error">{error || "Event tidak ditemukan."}</div>
        <Link to="/events" className="btn btn-secondary">
          Kembali ke daftar event
        </Link>
      </div>
    );
  }

  const isOwner = user && event.creator && (event.creator.id === user.id || event.created_by === user.id);

  return (
    <div className="page-root">
      <div className="card event-detail-card">
        <div className="event-detail-header">
          <div>
            <h1 className="page-title">{event.title}</h1>
            <p className="page-subtitle">{event.location || "Lokasi belum diisi"}</p>
          </div>
          <div className="event-detail-actions">
            <Link to="/events" className="btn btn-ghost">
              &larr; Kembali
            </Link>
            {isOwner && (
              <button className="btn btn-secondary" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="event-detail-body">
          <section className="event-section">
            <h2>Deskripsi</h2>
            <p>{event.description || "Belum ada deskripsi."}</p>
          </section>

          <section className="event-section event-section-grid">
            <div>
              <h3>Waktu mulai</h3>
              <p>
                {event.start_time
                  ? new Date(event.start_time).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })
                  : "-"}
              </p>
            </div>
            <div>
              <h3>Waktu selesai</h3>
              <p>
                {event.end_time
                  ? new Date(event.end_time).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })
                  : "-"}
              </p>
            </div>
            <div>
              <h3>Kuota</h3>
              <p>{event.quota || "Tidak dibatasi"}</p>
            </div>
          </section>

          <section className="event-section">
            <h3>Penyelenggara</h3>
            <p>{event.creator?.name || "Tidak diketahui"}</p>
          </section>

          {isAuthenticated && (
            <section className="event-section">
              <button className="btn btn-primary" onClick={handleRegister}>
                Daftar ke event ini
              </button>
              {actionMsg && <p className="text-muted mt-8">{actionMsg}</p>}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
