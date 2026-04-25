import { useState, useActionState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./LoginPage.scss";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword,        setShowPassword]        = useState(false);
  const [showForgotModal,     setShowForgotModal]     = useState(false);

  const loginAction = async (prevState, formData) => {
    const usernameOrEmail = formData.get("usernameOrEmail");
    const password        = formData.get("password");
    const role            = formData.get("role");

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

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: { password: data?.message || "Invalid username or password" },
        };
      }

      if (data.role.toUpperCase() !== role.toUpperCase()) {
        return {
          success: false,
          errors: {
            role: `This account is not a ${role} account. Your role is ${data.role}.`,
          },
        };
      }

      localStorage.setItem("token",    data.token);
      localStorage.setItem("userId",   data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email",    data.email);
      localStorage.setItem("role",     data.role);

      if (onLogin) onLogin(data.role);

      if      (data.role === "SUPER_ADMIN") navigate("/super-admin-dashboard");
      else if (data.role === "ADMIN")       navigate("/admin/dashboard");
      else if (data.role === "STAFF")       navigate("/staff/dashboard");
      else                                  navigate("/UserDashboard");

      return { success: true, errors: {} };

    } catch (error) {
      return {
        success: false,
        errors : { password: "Server error. Please try again." },
      };
    }
  };

  const [state, formAction] = useActionState(loginAction, {
    success: false,
    errors : {},
  });

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        <form action={formAction}>

          {/* ── ROLE SELECTOR ─────────────────────────────────── */}
          <div className="role-selector top-role-selector">
            <label><input type="radio" name="role" value="USER" defaultChecked />User</label>
            <label><input type="radio" name="role" value="STAFF" />Staff</label>
            <label><input type="radio" name="role" value="ADMIN" />Admin</label>
            <label><input type="radio" name="role" value="SUPER_ADMIN" />Super Admin</label>
          </div>
          {state.errors.role && (
            <div className="error-text">{state.errors.role}</div>
          )}

          {/* ── USERNAME OR EMAIL ──────────────────────────────── */}
          <input
            className="email-field"
            name="usernameOrEmail"
            type="text"
            placeholder="Enter Username or Email"
          />
          {state.errors.usernameOrEmail && (
            <div className="error-text">{state.errors.usernameOrEmail}</div>
          )}

          {/* ── PASSWORD ──────────────────────────────────────── */}
          <div className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {state.errors.password && (
            <div className="error-text">{state.errors.password}</div>
          )}

          {/* ── FORGOT PASSWORD ───────────────────────────────── */}
          <p
            className="forgot-password"
            onClick={() => setShowForgotModal(true)}
          >
            Forgot Password?
          </p>

          <button type="submit">Login</button>

          <p className="switch-text">
            Don't have an account?{" "}
            <span className="link-text" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>

        </form>
      </div>

      {/* ── FORGOT PASSWORD MODAL ─────────────────────────────── */}
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
}

export default LoginPage;