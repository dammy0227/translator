import React, { useState } from "react";
import { FiCopy } from "react-icons/fi"; // Copy icon
import './Translator.css';

const TranslationForm = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  const handleCopy = () => {
    if (text.trim()) {
      navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset copied state after 2s
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="translator-container">
      <div className="textarea-wrapper">
        <textarea 
          className="translator-textarea"
          rows="4"
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          className="copy-btn"
          onClick={handleCopy}
          title="Copy text"
        >
          <FiCopy />
        </button>
      </div>
      <br />
      <button type="submit" className="translator-button">Translate</button>
      {copied && <span className="copied-message">Copied!</span>}
    </form>
  );
};

export default TranslationForm;
