import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(form);
      setSuccess("Pendaftaran berhasil. Silakan login.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.message || "Pendaftaran gagal");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Daftar</h1>
        <p className="auth-subtitle">Buat akun baru untuk melanjutkan.</p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {success && <div className="auth-alert auth-alert-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nama lengkap</label>
            <input name="name" type="text" placeholder="Nama kamu" value={form.name} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input name="email" type="email" placeholder="kamu@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label>Kata sandi</label>
            <input name="password" type="password" placeholder="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="auth-actions">
            <button className="auth-btn auth-btn-primary" type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </div>
        </form>

        <p className="auth-footer-text">
          Sudah punya akun?{" "}
          <Link to="/login" className="auth-link">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
