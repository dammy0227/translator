import React, { useState } from "react";
import './Translator.css'

const TranslationForm = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  return (
<form onSubmit={handleSubmit} className="translator-container">
  <textarea
    className="translator-textarea"
    rows="4"
    placeholder="Enter text to translate..."
    value={text}
    onChange={(e) => setText(e.target.value)}
  />
  <br />
  <button type="submit" className="translator-button">Translate</button>
</form>

  );
};

export default TranslationForm;
