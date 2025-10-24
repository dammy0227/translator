import { translate } from "google-translate-api-x";
import Translation from "../models/Translation.js";

export const translateText = async (req, res) => {
  try {
    let { text, targetLanguage, sourceLanguage = "auto", userId = null } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    // ✳️ Step 1: Identify known proper nouns to protect
    const protectedNames = [
      "Moshood Abiola Polytechnic",
      "Moshood",
      "Abiola",
      "Nigeria",
      "Yoruba",
      'Mapoly'
    ];

    // ✳️ Step 2: Replace them with placeholder tags before translation
    protectedNames.forEach((name, index) => {
      const placeholder = `__NAME_${index}__`;
      text = text.replace(new RegExp(name, "gi"), placeholder);
    });

    // ✳️ Step 3: Perform translation
    const result = await translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    let translatedText = result.text;

    // ✳️ Step 4: Restore original names
    protectedNames.forEach((name, index) => {
      const placeholder = `__NAME_${index}__`;
      translatedText = translatedText.replace(new RegExp(placeholder, "g"), name);
    });

    // Save to database (optional)
    try {
      await Translation.create({
        userId,
        original: text,
        translated: translatedText,
        sourceLanguage: result.from.language.iso,
        targetLanguage,
      });
    } catch (e) {
      console.warn("⚠️ Failed to save translation:", e.message);
    }

    return res.json({
      translatedText,
      detectedSourceLanguage: result.from.language.iso,
    });
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return res.status(500).json({ error: "Translation failed" });
  }
};
