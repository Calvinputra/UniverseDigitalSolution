import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: 2, // misalnya 2 = guest
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(form);
      setSuccess("Register berhasil, silakan login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message || "Register gagal");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="field">
          <label>Nama</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>

        <button disabled={loading} type="submit">
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      <p>
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
