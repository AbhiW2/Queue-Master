
import { useFormik } from "formik";
import * as Yup from "yup";   // <-- Add Yup
import { useNavigate } from "react-router-dom";
import "../styles/SignUpPage.scss";
import queueImage from "../assets/queue.png";

function SignUpPage() {
  const navigate = useNavigate();

  // --------------------------📌 VALIDATION SCHEMA --------------------------
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be minimum 6 characters"),

    confirmPassword: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "", confirmPassword: "" },
    validationSchema,  // <-- Add this
    onSubmit: (values, { setStatus }) => {
      
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify({
        username: values.username,
        password: values.password,
      }));

      alert("Account created successfully! Please login.");
      navigate("/");
    },
  });

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${queueImage})` }}>
      <div className="signup-container">
        <h2>Sign Up</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Username */}
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.errors.username && formik.touched.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password && formik.touched.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="error-message">
              {formik.errors.confirmPassword}
            </div>
          )}

          <button type="submit">Sign Up</button>

          <p className="switch-text">
            Already have an account?{" "}
            <span className="link-text" onClick={() => navigate("/")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
