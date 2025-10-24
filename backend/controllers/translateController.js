import { translate } from "google-translate-api-x";
import Translation from "../models/Translation.js";

export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = "auto", userId = null } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    const result = await translate(text, {
      from: sourceLanguage,
      to: targetLanguage
    });

    // Save to DB (non-blocking)
    try {
      await Translation.create({
        userId,
        original: text,
        translated: result.text,
        sourceLanguage: result.from.language.iso,
        targetLanguage
      });
    } catch (e) {
      console.warn("⚠️ Failed to save translation:", e.message);
    }

    return res.json({
      translatedText: result.text,
      detectedSourceLanguage: result.from.language.iso
    });
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return res.status(500).json({ error: "Translation failed" });
  }
};
