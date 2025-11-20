import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, loginAsGuest, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const message = location.state?.message;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/events");
    } catch (err) {
      setError(err.message || "Login gagal");
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate("/events");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Pesan dari redirect (misalnya dari /events/new) */}
        {message && (
          <div
            style={{
              background: "#f87171",
              color: "white",
              padding: "10px 14px",
              fontSize: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {message}
          </div>
        )}

        <h1 className="auth-title">Masuk</h1>
        <p className="auth-subtitle">Gunakan email terdaftar untuk masuk.</p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input name="email" type="email" placeholder="kamu@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label>Kata sandi</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>

          <div className="auth-actions">
            <button className="auth-btn auth-btn-primary" type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </button>
            <button type="button" className="auth-btn auth-btn-secondary" onClick={handleGuest}>
              Masuk sebagai tamu
            </button>
          </div>
        </form>

        <p className="auth-footer-text">
          Belum punya akun?{" "}
          <Link to="/register" className="auth-link">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
