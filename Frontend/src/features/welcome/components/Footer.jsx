import React from "react";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    
    <footer className="footer-section pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row text-md-left">

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-white">QueueMS</h5>
            <p>
              A smart queue management system that helps users avoid long waiting lines
              and enables organizations to serve customers efficiently.
            </p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-white">Services</h5>
            <p><a href="#" className="footer-link">Hospitals</a></p>
            <p><a href="#" className="footer-link">Banks</a></p>
            <p><a href="#" className="footer-link">Government Offices</a></p>
            <p><a href="#" className="footer-link">Customer Support</a></p>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-white">Useful Links</h5>
            <p><a href="#" className="footer-link">Your Account</a></p>
            <p><a href="#" className="footer-link">Help Center</a></p>
            <p><a href="#" className="footer-link">Privacy Policy</a></p>
            <p><a href="#" className="footer-link">Terms & Conditions</a></p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-white">Contact</h5>
            <p><i className="fas fa-home me-2"></i> India</p>
            <p><i className="fas fa-envelope me-2"></i> support@queuems.com</p>
            <p><i className="fas fa-phone me-2"></i> +91 98765 43210</p>
          </div>

        </div>

        <hr className="mb-4" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-center text-md-start">
              © 2026 QueueMS. All Rights Reserved.
            </p>
          </div>
           <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          />
          <div className="col-md-5 col-lg-4">
            <div className="text-center text-md-end">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;