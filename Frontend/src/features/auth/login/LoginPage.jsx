import { useState, useActionState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step,         setStep]         = useState(1);

  const loginAction = async (prevState, formData) => {
    const usernameOrEmail = formData.get("usernameOrEmail");
    const password        = formData.get("password");
    const role            = formData.get("role");

    // ── Frontend Validation ──────────────────────────
    let errors = {};

    if (!usernameOrEmail || usernameOrEmail.length < 3) {
      errors.usernameOrEmail = "Username must be at least 3 characters";
    }
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!role) {
      errors.role = "Please select a role";
    }
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    // ── API Call ─────────────────────────────────────
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      // ── Login failed ─────────────────────────────
      if (!response.ok) {
        return {
          success: false,
          errors: { password: data?.message || "Invalid username or password" },
        };
      }

      // ── Role match check ─────────────────────────
      if (data.role.toUpperCase() !== role.toUpperCase()) {
        return {
          success: false,
          errors: {
            role: `This account is not a ${role} account. Your role is ${data.role}.`
          },
        };
      }

      // ── Save to localStorage ──────────────────────
      localStorage.setItem("token",    data.token);
      localStorage.setItem("userId",   data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email",    data.email);
      localStorage.setItem("role",     data.role);

      // ── Notify parent ─────────────────────────────
      if (onLogin) onLogin(data.role);

      // ── Redirect based on role ────────────────────
      if (data.role === "SUPER_ADMIN") {
        navigate("/super-admin-dashboard");      // ✅ Super Admin
      } else if (data.role === "ADMIN") {
        navigate("/admin/dashboard");            // ✅ Admin
      } else if (data.role === "STAFF") {
        navigate("/staff/dashboard");            // ✅ Staff
      } else {
        navigate("/UserDashboard");              // ✅ User
      }

      return { success: true, errors: {} };

    } catch (error) {
      return {
        success : false,
        errors  : { password: "Server error. Please try again." },
      };
    }
  };

  const [state, formAction] = useActionState(loginAction, {
    success: false,
    errors : {},
  });

  // ── OTP (UI only — no backend yet) ────────────────
  const handleSendOtp = (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    alert("OTP sent to email: " + otp);
    setStep(2);
  };

  const handleVerifyOtp = (otpInput) => {
    if (otpInput === generatedOtp) {
      alert("Password reset successful!");
      setShowModal(false);
      setStep(1);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        <form action={formAction}>

          {/* ── ROLE SELECTOR ──────────────────────── */}
          <div className="role-selector top-role-selector">
            <label>
              <input type="radio" name="role" value="USER" defaultChecked />
              User
            </label>
            <label>
              <input type="radio" name="role" value="STAFF" />
              Staff
            </label>
            <label>
              <input type="radio" name="role" value="ADMIN" />
              Admin
            </label>
            <label>
              <input type="radio" name="role" value="SUPER_ADMIN" />
              Super Admin
            </label>
          </div>
          {state.errors.role && (
            <div className="error-text">{state.errors.role}</div>
          )}

          {/* ── USERNAME OR EMAIL ───────────────────── */}
          <input
            className="email-field"
            name="usernameOrEmail"
            type="text"
            placeholder="Enter Username or Email"
          />
          {state.errors.usernameOrEmail && (
            <div className="error-text">{state.errors.usernameOrEmail}</div>
          )}

          {/* ── PASSWORD ────────────────────────────── */}
          <div className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {state.errors.password && (
            <div className="error-text">{state.errors.password}</div>
          )}

          <p
            className="forgot-password"
            onClick={() => setShowModal(true)}
          >
            Forgot Password?
          </p>

          <button type="submit">Login</button>

          <p className="switch-text">
            Don't have an account?{" "}
            <span
              className="link-text"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

        </form>
      </div>

      {/* ── OTP MODAL ──────────────────────────────── */}
      {showModal && (
        <div className="otp-modal">
          <div className="otp-box">
            <h3>Reset Password</h3>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  id="resetEmail"
                />
                <button
                  onClick={() =>
                    handleSendOtp(
                      document.getElementById("resetEmail").value
                    )
                  }
                >
                  Send OTP
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  id="otpInput"
                />
                <button
                  onClick={() =>
                    handleVerifyOtp(
                      document.getElementById("otpInput").value
                    )
                  }
                >
                  Verify OTP
                </button>
              </>
            )}
            <p
              className="close-modal"
              onClick={() => { setShowModal(false); setStep(1); }}
            >
              Cancel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;