  import React from "react";
  import "../styles/Navbar.scss";
  import { Link } from "react-router-dom";

  const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="logo">Queue Master</div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#features">Features</a>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/login" className="nav-btn">Get Started</Link>
        </div>
      </nav>
    );
  };

  export default Navbar;


