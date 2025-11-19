import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
      if (String(err.message).toLowerCase().includes("unauthorized")) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus event ini?")) return;
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message || "Gagal hapus");
    }
  };

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Events</h1>
        <div>
          <button onClick={() => navigate("/events/new")}>+ Event Baru</button>
          <button onClick={logout} style={{ marginLeft: 8 }}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>Belum ada event.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Lokasi</th>
              <th>Start</th>
              <th>End</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.id}</td>
                <td>{ev.title}</td>
                <td>{ev.location}</td>
                <td>{ev.start_time}</td>
                <td>{ev.end_time}</td>
                <td>
                  <Link to={`/events/${ev.id}/edit`}>Edit</Link> <button onClick={() => handleDelete(ev.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
