import React from "react";
import Navbar from "../../../components/layouts/Navbar";
import Footer from "../../../components/layouts/Footer";
import "../styles/Welcome.scss";

const Welcome = () => {
  return (
    <>
      <Navbar />

      {/* 🌟 Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Skip the Line. Save Your Time.</h1>
          <p>
            Join queues remotely, get live updates, and walk in only when it's your turn.
            Smart waiting starts here.
          </p>
          <div className="hero-buttons">
            <a href="/login" className="primary-btn">Join a Queue</a>
            <a href="#features" className="secondary-btn">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4341/4341139.png"
            alt="Queue Illustration"
          />
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section id="features" className="features">
        <h2>Why Choose Our Queue System?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>📱 Join From Anywhere</h3>
            <p>No need to stand in line physically. Book your slot remotely.</p>
          </div>
          <div className="card">
            <h3>⏱ Live Wait Time</h3>
            <p>Track real-time queue position and estimated waiting time.</p>
          </div>
          <div className="card">
            <h3>🔔 Instant Alerts</h3>
            <p>Get notified when your turn is approaching.</p>
          </div>
          <div className="card">
            <h3>🏢 Multi-Service Support</h3>
            <p>Hospitals, banks, government offices, and more.</p>
          </div>
        </div>
      </section>

      {/* 📖 About Section */}
      <section id="about" className="about">
        <div className="about-text">
          <h2>Built for Real-World Waiting Problems</h2>
          <p>
            Our Queue Management System helps businesses reduce crowding and improve customer experience.
            Spend less time waiting and more time doing what matters.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Welcome;

