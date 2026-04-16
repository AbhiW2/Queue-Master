import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiTarget,
  FiShield,
  FiTrendingUp,
  FiArrowRight
} from "react-icons/fi";
import "../styles/About.scss";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* ===== NAV BAR ===== */}
      <div className="about-navbar">
        <h2>Queue Master</h2>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="hero-text">
          <h1>Reinventing Queue Management for the Digital Era</h1>
          <p>
            QueueMaster helps organizations eliminate physical waiting lines
            and deliver faster, smarter, and more convenient service experiences.
          </p>
          <button className="primary-btn">
            Explore Features <FiArrowRight />
          </button>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="about-stats">
        <div className="stat">
          <h2>250K+</h2>
          <p>Tokens Generated</p>
        </div>
        <div className="stat">
          <h2>120+</h2>
          <p>Organizations Using QueueMaster</p>
        </div>
        <div className="stat">
          <h2>40%</h2>
          <p>Average Waiting Time Reduced</p>
        </div>
        <div className="stat">
          <h2>99.9%</h2>
          <p>System Uptime</p>
        </div>
      </section>

      {/* ===== MISSION / VISION ===== */}
      <section className="about-mission">
        <div className="card">
          <FiTarget className="icon purple" />
          <h3>Our Mission</h3>
          <p>
            To digitize service queues and empower people to wait smarter,
            not longer.
          </p>
        </div>

        <div className="card">
          <FiTrendingUp className="icon blue" />
          <h3>Our Vision</h3>
          <p>
            To become the global platform powering seamless service experiences
            everywhere.
          </p>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="about-features">
        <h2>Why Organizations Choose QueueMaster</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <FiUsers className="icon green" />
            <h4>Live Queue Tracking</h4>
            <p>Customers can monitor queue progress from anywhere.</p>
          </div>

          <div className="feature-card">
            <FiShield className="icon blue" />
            <h4>Enterprise Security</h4>
            <p>Built with secure architecture and privacy-first design.</p>
          </div>

          <div className="feature-card">
            <FiTarget className="icon orange" />
            <h4>Smart Flow Optimization</h4>
            <p>AI-assisted queue distribution reduces congestion.</p>
          </div>

          <div className="feature-card">
            <FiTrendingUp className="icon purple" />
            <h4>Performance Analytics</h4>
            <p>Real-time insights help improve service efficiency.</p>
          </div>
        </div>
      </section>

      {/* ===== COMPANY STORY ===== */}
      <section className="about-story">
        <div className="story-text">
          <h2>Built for Modern Service Experiences</h2>
          <p>
            QueueMaster was founded with a simple goal — remove the frustration
            of long waiting lines. Today, we power digital queue systems for
            hospitals, banks, government offices, and enterprises.
          </p>
          <p>
            Our platform blends real-time tracking, predictive wait estimation,
            and intelligent scheduling to make every visit smooth and stress-free.
          </p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="about-cta">
        <h2>Experience the Future of Queue Management</h2>
        <p>Join organizations already delivering smarter service experiences.</p>
        <button onClick={() => navigate("/dashboard")}>Get Started</button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="about-footer">
        © {new Date().getFullYear()} QueueMaster Technologies Pvt. Ltd.
      </footer>
    </div>
  );
};

export default About;
