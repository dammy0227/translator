import React, { useEffect, useState } from "react";
import { fetchLanguages, translateText } from "../services/api";
import LanguageSelector from "../components/LanguageSelector";
import TranslationForm from "../components/TranslationForm";
import { Copy } from "lucide-react"; 
import "../components/Translator.css";

const Home = () => {
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langs = await fetchLanguages();
        setLanguages([{ code: "auto", name: "Auto Detect" }, ...langs]);
      } catch (err) {
        console.error("Failed to load languages", err);
      }
    };
    loadLanguages();
  }, []);

  const handleTranslate = async (text) => {
    try {
      const res = await translateText({
        text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      setResult(res);
    } catch (err) {
      console.error("Translation failed", err);
    }
  };

  const handleCopy = async () => {
    if (!result?.translatedText) return;
    try {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Failed to copy:", err);
    }
  };

  return (
    <div>
      <h1>Translator</h1>

      <LanguageSelector
        languages={languages}
        value={sourceLang}
        onChange={setSourceLang}
        label="Source Language"
      />

      <LanguageSelector
        languages={languages}
        value={targetLang}
        onChange={setTargetLang}
        label="Target Language"
      />

      <TranslationForm onSubmit={handleTranslate} />

      {result?.translatedText && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            borderRadius: "8px",
            background: "#f4f4f4",
            border: "1px solid #ddd",
          }}
        >
          <p>
            <strong>Detected Source:</strong>{" "}
            {result.detectedSourceLanguage || "Unknown"}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span style={{ flex: 1, marginRight: "10px" }}>
              {result.translatedText}
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#0077ff",
              }}
              title="Copy"
            >
              <Copy size={18} />
            </button>
          </div>

          {copied && (
            <small style={{ color: "green", display: "block", marginTop: "5px" }}>
              ✅ Copied!
            </small>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
