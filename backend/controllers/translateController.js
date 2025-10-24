import { translate } from "google-translate-api-x";
import Translation from "../models/Translation.js";

export const translateText = async (req, res) => {
  try {
    let { text, targetLanguage, sourceLanguage = "auto", userId = null } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    // ✳️ Step 1: Identify proper nouns or names to protect
    const protectedNames = [
      "Moshood Abiola Polytechnic",
      "Moshood",
      "Abiola",
      "Nigeria",
      "Yoruba",
      "Mapoly"
    ];

    // ✳️ Step 2: Replace names with unique placeholders before translation
    protectedNames.forEach((name, index) => {
      const placeholder = `@@NAME_${index}@@`; // ✅ safer placeholder
      const regex = new RegExp(name, "gi");
      text = text.replace(regex, placeholder);
    });

    // ✳️ Step 3: Perform translation
    const result = await translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    let translatedText = result.text;

    // ✳️ Step 4: Restore original names after translation
    protectedNames.forEach((name, index) => {
      const placeholder = `@@NAME_${index}@@`;
      const regex = new RegExp(placeholder, "g");
      translatedText = translatedText.replace(regex, name);
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
