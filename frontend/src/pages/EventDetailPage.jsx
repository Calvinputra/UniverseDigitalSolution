import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useParams, Link } from "react-router-dom";

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.getEvent(id);
        setEvent(res.data || null);
      } catch (err) {
        setError(err.message || "Gagal memuat event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p style={{ padding: 24 }}>Memuat...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  if (!event) return <p style={{ padding: 24 }}>Event tidak ditemukan.</p>;

  return (
    <div style={{ padding: 32 }}>
      <Link to="/events">&larr; Kembali</Link>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Lokasi: {event.location}</p>
      <p>Mulai: {event.start_time}</p>
      <p>Selesai: {event.end_time}</p>
      <p>
        Kuota: {event.attendees_count} / {event.quota}
      </p>
    </div>
  );
}
