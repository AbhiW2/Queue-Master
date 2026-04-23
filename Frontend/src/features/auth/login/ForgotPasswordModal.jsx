import React, { useState, useRef, useEffect } from "react";
import "./ForgotPasswordModal.scss";

// ─── Constants ───────────────────────────────────────────────────────────────
const API = "http://localhost:8080/api/auth/password-reset";
const RESEND_COOLDOWN_SECONDS = 60;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const post = async (url, body) => {
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Something went wrong.");
  return data;
};

// ─── OTP Input (6 individual boxes) ─────────────────────────────────────────
const OtpInput = ({ value, onChange, disabled }) => {
  const inputs = useRef([]);

  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (e, idx) => {
    const char = e.key;

    if (char === "Backspace") {
      const next = digits.map((d, i) => (i === idx ? "" : d)).join("");
      onChange(next);
      if (idx > 0) inputs.current[idx - 1]?.focus();
      return;
    }

    if (char === "ArrowLeft"  && idx > 0) { inputs.current[idx - 1]?.focus(); return; }
    if (char === "ArrowRight" && idx < 5) { inputs.current[idx + 1]?.focus(); return; }

    if (!/^\d$/.test(char)) return;

    const next = digits.map((d, i) => (i === idx ? char : d)).join("");
    onChange(next);
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  // Handle paste — accept 6 digits pasted at once
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(paste.padEnd(6, "").slice(0, 6));
    if (paste.length === 6) inputs.current[5]?.focus();
  };

  return (
    <div className="otp-boxes">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          className={`otp-box ${d ? "filled" : ""}`}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          onChange={() => {}} // controlled via onKeyDown
          autoComplete="one-time-code"
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

// ─── Resend Timer ─────────────────────────────────────────────────────────────
const ResendTimer = ({ onResend, loading }) => {
  const [seconds, setSeconds] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleResend = () => {
    setSeconds(RESEND_COOLDOWN_SECONDS);
    onResend();
  };

  if (seconds > 0) {
    return (
      <p className="resend-text">
        Resend code in <span className="resend-timer">{seconds}s</span>
      </p>
    );
  }

  return (
    <button
      type="button"
      className="resend-btn"
      onClick={handleResend}
      disabled={loading}
    >
      Resend OTP
    </button>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  // step: "email" | "otp" | "password" | "success"
  const [step,        setStep]        = useState("email");
  const [email,       setEmail]       = useState("");
  const [otp,         setOtp]         = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Step 1: Request OTP ────────────────────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) { setError("Please enter your email."); return; }

    setLoading(true);
    try {
      const data = await post(`${API}/request`, { email: email.trim() });
      setSuccess(data.message);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (otp.replace(/\D/g, "").length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await post(`${API}/verify`, { email: email.trim(), otp });
      clearMessages();
      setStep("password");
    } catch (err) {
      setError(err.message);
      if (err.message.includes("request a new")) {
        // OTP exhausted — push user back to email step
        setTimeout(() => {
          setOtp("");
          setStep("email");
          clearMessages();
        }, 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend — go back to step 1 logic without changing the email
  const handleResend = async () => {
    clearMessages();
    setOtp("");
    setLoading(true);
    try {
      const data = await post(`${API}/request`, { email: email.trim() });
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ─────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await post(`${API}/reset`, {
        email:           email.trim(),
        otp,
        newPassword,
        confirmPassword: confirmPw,
      });
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step labels ─────────────────────────────────────────────────────────
  const steps = ["Email", "Verify OTP", "New Password"];
  const stepIndex = { email: 0, otp: 1, password: 2, success: 3 };
  const current = stepIndex[step] ?? 0;

  return (
    <div className="fp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fp-modal" role="dialog" aria-modal="true"
           aria-labelledby="fp-title">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="fp-header">
          <div className="fp-header-left">
            <div className="fp-icon">🔐</div>
            <div>
              <h3 id="fp-title">Reset Password</h3>
              <p>We'll send a code to your email</p>
            </div>
          </div>
          <button className="fp-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Step indicator ─────────────────────────────────────────── */}
        {step !== "success" && (
          <div className="fp-steps" aria-label="Progress">
            {steps.map((label, i) => (
              <React.Fragment key={label}>
                <div className={`fp-step ${i < current ? "done" : i === current ? "active" : ""}`}>
                  <div className="fp-step-dot">
                    {i < current ? "✓" : i + 1}
                  </div>
                  <span>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`fp-step-line ${i < current ? "done" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="fp-body">

          {/* Alert messages */}
          {error   && <div className="fp-alert error"   role="alert">⚠ {error}</div>}
          {success && <div className="fp-alert success" role="status">✓ {success}</div>}

          {/* ── STEP 1: Email ──────────────────────────────────────── */}
          {step === "email" && (
            <form onSubmit={handleRequestOtp} noValidate>
              <p className="fp-description">
                Enter your registered email address and we'll send you
                a 6-digit code.
              </p>
              <div className="fp-field">
                <label htmlFor="fp-email">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="fp-btn-primary" disabled={loading}>
                {loading ? <><span className="btn-spinner" /> Sending…</> : "Send OTP →"}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ────────────────────────────────────────── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} noValidate>
              <p className="fp-description">
                Enter the 6-digit code sent to <strong>{email}</strong>.
                It expires in 10 minutes.
              </p>

              <OtpInput
                value={otp}
                onChange={val => { setOtp(val); clearMessages(); }}
                disabled={loading}
              />

              <button
                type="submit"
                className="fp-btn-primary"
                disabled={loading || otp.replace(/\D/g, "").length !== 6}
              >
                {loading ? <><span className="btn-spinner" /> Verifying…</> : "Verify Code →"}
              </button>

              <div className="fp-resend-row">
                <ResendTimer onResend={handleResend} loading={loading} />
                <button
                  type="button"
                  className="fp-link-btn"
                  onClick={() => { setStep("email"); clearMessages(); setOtp(""); }}
                >
                  Change email
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: New Password ────────────────────────────────── */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} noValidate>
              <p className="fp-description">
                Choose a strong new password for <strong>{email}</strong>.
              </p>

              <div className="fp-field">
                <label htmlFor="fp-newpw">New Password</label>
                <div className="fp-pw-wrap">
                  <input
                    id="fp-newpw"
                    type={showPw ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    autoFocus
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="fp-toggle-pw"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Password strength bar */}
                <PasswordStrength password={newPassword} />
              </div>

              <div className="fp-field">
                <label htmlFor="fp-confirmpw">Confirm Password</label>
                <input
                  id="fp-confirmpw"
                  type={showPw ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                {confirmPw && newPassword !== confirmPw && (
                  <span className="fp-field-error">Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                className="fp-btn-primary"
                disabled={
                  loading ||
                  newPassword.length < 6 ||
                  newPassword !== confirmPw
                }
              >
                {loading
                  ? <><span className="btn-spinner" /> Resetting…</>
                  : "Reset Password"}
              </button>
            </form>
          )}

          {/* ── SUCCESS ─────────────────────────────────────────────── */}
          {step === "success" && (
            <div className="fp-success">
              <div className="fp-success-icon">✓</div>
              <h4>Password Reset!</h4>
              <p>Your password has been updated successfully.<br />
                 You can now log in with your new password.</p>
              <button className="fp-btn-primary" onClick={onClose}>
                Go to Login
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Password strength indicator ─────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"];

  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="pw-bar"
            style={{ background: i <= score ? colors[score] : "var(--color-border-tertiary)" }}
          />
        ))}
      </div>
      <span className="pw-label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
};

export default ForgotPasswordModal;