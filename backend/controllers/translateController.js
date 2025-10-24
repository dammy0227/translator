import fetch from "node-fetch";
import Translation from "../models/Translation.js";

/**
 * 🌍 LibreTranslate-based Translator
 */
export const translateText = async (req, res) => {
  try {
    let { text, targetLanguage, sourceLanguage = "auto", userId = null } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    // 🧠 Step 1: Call LibreTranslate API
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage === "auto" ? "en" : sourceLanguage,
        target: targetLanguage,
        format: "text",
      }),
    });

    const data = await response.json();

    if (!data.translatedText) {
      throw new Error("Translation failed or invalid response from LibreTranslate");
    }

    // 💾 Step 2: Save to MongoDB (optional)
    try {
      await Translation.create({
        userId,
        original: text,
        translated: data.translatedText,
        sourceLanguage,
        targetLanguage,
      });
    } catch (e) {
      console.warn("⚠️ Failed to save translation:", e.message);
    }

    // 📤 Step 3: Send translation result
    return res.json({
      translatedText: data.translatedText,
      detectedSourceLanguage: sourceLanguage,
    });
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return res.status(500).json({ error: "Translation failed" });
  }
};
