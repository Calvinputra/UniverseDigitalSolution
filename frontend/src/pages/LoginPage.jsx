import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, loginAsGuest, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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
    setError("");
    loginAsGuest();
    navigate("/events");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          <button disabled={loading} type="submit" className="btn-primary">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="auth-text">
          Belum punya akun? <Link to="/register">Register</Link>
        </p>

        <div className="auth-divider">
          <span>atau</span>
        </div>

        <button type="button" className="btn-ghost" onClick={handleGuest} disabled={loading}>
          Masuk sebagai Tamu
        </button>
      </div>
    </div>
  );
}
