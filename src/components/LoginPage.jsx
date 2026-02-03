
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.scss";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: "user",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      role: Yup.string().required("Please select a role"),
    }),

    onSubmit: (values) => {
      localStorage.setItem("role", values.role);
      localStorage.setItem("username", values.username);

      onLogin(values.role);

      if (values.role === "admin") navigate("/admin-dashboard");
      else if (values.role === "staff") navigate("/staff-dashboard");
      else navigate("/dashboard");
    },
  });

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* 🔹 Role Selection at TOP */}
          <div className="role-selector top-role-selector">
            <label className={formik.values.role === "user" ? "active" : ""}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formik.values.role === "user"}
                onChange={formik.handleChange}
              />
              User
            </label>

            <label className={formik.values.role === "staff" ? "active" : ""}>
              <input
                type="radio"
                name="role"
                value="staff"
                checked={formik.values.role === "staff"}
                onChange={formik.handleChange}
              />
              Staff
            </label>

            <label className={formik.values.role === "admin" ? "active" : ""}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formik.values.role === "admin"}
                onChange={formik.handleChange}
              />
              Admin
            </label>
          </div>

          {formik.touched.role && formik.errors.role && (
            <div className="error-message">{formik.errors.role}</div>
          )}

          {/* Username */}
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}

          <button type="submit">Login</button>

          <p className="switch-text">
            Don't have an account?{" "}
            <span className="link-text" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
