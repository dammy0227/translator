import React, { useEffect, useState } from "react";
import { fetchLanguages, translateText } from "../services/api";
import LanguageSelector from "../components/LanguageSelector";
import TranslationForm from "../components/TranslationForm";
import TranslationResult from "../components/TranslationResult";
import '../components/Translator.css'

const Home = () => {
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState(null);

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

      <TranslationResult
        text={result?.translatedText}
        detectedSource={result?.detectedSourceLanguage}
      />
    </div>
  );
};

export default Home;
