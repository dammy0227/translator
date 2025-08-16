import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // import the CSS file

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">🌍 Welcome to My Translator</h1>
      <p className="landing-text">
        Instantly translate your text into multiple languages.
      </p>
      <button className="landing-button" onClick={() => navigate("/home")}>
        🚀 Start
      </button>
    </div>
  );
};

export default LandingPage;
