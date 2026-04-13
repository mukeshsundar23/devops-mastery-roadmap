import { useState } from "react";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Something went wrong.");
        return;
      }

      onLogin(data.access_token);
    } catch {
      setError("Could not reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#06060c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
      padding: 16,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: #0a0a12;
          border: 1px solid #1a1a2e;
          border-radius: 20px;
          padding: 40px 36px;
          animation: fadeUp 0.3s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-label {
          font-size: 10px;
          color: #4a4a68;
          letter-spacing: 0.15em;
          font-weight: 600;
          margin-bottom: 7px;
          display: block;
        }
        .login-input {
          width: 100%;
          background: #06060c;
          border: 1px solid #1a1a2e;
          border-radius: 8px;
          padding: 12px 16px;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: #4ade8050;
          box-shadow: 0 0 0 3px rgba(74,222,128,0.06);
        }
        .login-input::placeholder { color: #2d2d45; }
        .login-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, rgba(34,211,238,0.12), rgba(74,222,128,0.12));
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 8px;
          color: #4ade80;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 6px;
        }
        .login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(34,211,238,0.2), rgba(74,222,128,0.2));
          border-color: rgba(74,222,128,0.5);
          box-shadow: 0 0 20px rgba(74,222,128,0.1);
        }
        .login-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .tab-btn {
          flex: 1;
          padding: 8px 12px;
          background: transparent;
          border: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 6px;
        }
        .tab-btn-active { color: #f1f5f9; background: #12121e; }
        .tab-btn-inactive { color: #3d3d5c; }
        .tab-btn-inactive:hover { color: #6b6b90; }
      `}</style>

      <div className="login-card">
        {/* ── Brand ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 9, letterSpacing: "0.4em", color: "#22d3ee",
            fontWeight: 700, marginBottom: 14,
          }}>
            ◆ DEVOPS MASTERY ROADMAP
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 26, fontWeight: 800,
            color: "#f1f5f9", lineHeight: 1.25,
          }}>
            Your Roadmap.<br />
            <span style={{ color: "#818cf8" }}>Your Progress.</span>
          </div>
          <div style={{ fontSize: 11, color: "#3d3d5c", marginTop: 10 }}>
            60 projects · 20 weeks · 8 phases
          </div>
        </div>

        {/* ── Mode tabs ─────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 4,
          background: "#06060c",
          borderRadius: 8, padding: 4,
          marginBottom: 28,
        }}>
          {[["login", "SIGN IN"], ["register", "REGISTER"]].map(([m, label]) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`tab-btn ${mode === m ? "tab-btn-active" : "tab-btn-inactive"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Form ──────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="login-label">USERNAME</label>
            <input
              id="username"
              className="login-input"
              type="text"
              placeholder="yourname"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              minLength={2}
            />
          </div>

          <div>
            <label className="login-label">PASSWORD</label>
            <input
              id="password"
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
            />
            {mode === "register" && (
              <div style={{ fontSize: 10, color: "#3d3d5c", marginTop: 6 }}>
                min 6 characters
              </div>
            )}
          </div>

          {error && (
            <div style={{
              fontSize: 11, color: "#f87171",
              background: "rgba(248,113,113,0.07)",
              border: "1px solid rgba(248,113,113,0.18)",
              borderRadius: 7, padding: "9px 13px",
            }}>
              {error}
            </div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading
              ? "CONNECTING..."
              : mode === "login"
              ? "SIGN IN →"
              : "CREATE ACCOUNT →"}
          </button>
        </form>
      </div>
    </div>
  );
}
