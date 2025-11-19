import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

export function EventFormPage() {
  const { id } = useParams(); // "new" atau angka
  const isEdit = id && id !== "new";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    quota: 0,
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        setLoading(true);
        try {
          const data = await api.getEvent(id);
          setForm({
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            quota: data.quota || 0,
            start_time: data.start_time?.slice(0, 16) || "",
            end_time: data.end_time?.slice(0, 16) || "",
          });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "quota" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await api.updateEvent(id, payload);
      } else {
        await api.createEvent(payload);
      }
      navigate("/events");
    } catch (err) {
      alert(err.message || "Gagal menyimpan event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{isEdit ? "Edit Event" : "Event Baru"}</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="field">
          <label>Judul</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Lokasi</label>
          <input name="location" value={form.location} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Quota</label>
          <input name="quota" type="number" value={form.quota} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Start Time</label>
          <input name="start_time" type="datetime-local" value={form.start_time} onChange={handleChange} />
        </div>

        <div className="field">
          <label>End Time</label>
          <input name="end_time" type="datetime-local" value={form.end_time} onChange={handleChange} />
        </div>

        <button disabled={loading} type="submit">
          {loading ? "Saving..." : "Simpan"}
        </button>
        <button type="button" onClick={() => navigate("/events")} style={{ marginLeft: 8 }}>
          Batal
        </button>
      </form>
    </div>
  );
}
