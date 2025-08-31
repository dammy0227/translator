import React, { useState } from "react";
import { Copy, ClipboardPaste } from "lucide-react"; 
import './Translator.css';

const TranslationForm = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  const handleCopy = async () => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const pasteText = await navigator.clipboard.readText();
      setText((prev) => prev + (prev ? " " : "") + pasteText);
    } catch (err) {
      console.error("❌ Failed to paste:", err);
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
        <div className="textarea-actions">
          <button type="button" onClick={handleCopy} title="Copy input text">
            <Copy size={18} />
          </button>
          <button type="button" onClick={handlePaste} title="Paste from clipboard">
            <ClipboardPaste size={18} />
          </button>
        </div>
      </div>
      <br />
      <button type="submit" className="translator-button">Translate</button>
      {copied && <span className="copied-message">✅ Copied!</span>}
    </form>
  );
};

export default TranslationForm;
