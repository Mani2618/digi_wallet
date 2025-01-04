import React from "react";
import "./AboutPage.css"; // Link to your CSS file
import  mail from "./mail.png";
import call from "./call.png";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="hero-section">
        <h1>About PayTM UPI</h1>
        <p>
          Simplifying your digital payments. PayTM UPI enables fast, secure, and
          easy money transfers through your UPI ID. Experience seamless transactions
          anywhere, anytime.
        </p>
        <button className="cta-button">Start Using PayTM UPI</button>
      </div>

      <div className="features-section">
        <h2>Why PayTM UPI?</h2>
        <div className="features">
          <div className="feature-card">
            <i className="feature-icon fas fa-bolt"></i>
            <h3>Lightning-fast Transactions</h3>
            <p>Send and receive money instantly with PayTM UPI. Fast, reliable, and seamless.</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon fas fa-shield-alt"></i>
            <h3>Top-notch Security</h3>
            <p>Your data is safe with us. PayTM UPI ensures secure transactions with the latest encryption.</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon fas fa-cogs"></i>
            <h3>Easy to Use</h3>
            <p>The intuitive interface makes it easy for anyone to start using PayTM UPI without any hassle.</p>
          </div>
        </div>
      </div>

      <div className="our-mission-section">
        <h2>Our Mission</h2>
        <p>
          At PayTM UPI, we believe in transforming the way people send and receive money. Our mission is to
          provide everyone with an easy, secure, and reliable way to handle their finances, anytime and anywhere.
        </p>
      </div>

      <div className="team-section">
        <h2>Customer Support</h2>
        <div className="team-cards">
          <div className="team-card">
            <img src={ mail } alt="Team Member" className="mail-" />
            <h3>E-mail</h3>
            <p>24/7 Customer support</p>
          </div>
          <div className="team-card">
            <img src={ call } alt="Team Member" className="call-"/>
            <h3>Via-Call</h3>
            <p>Connect to Customer Care</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
