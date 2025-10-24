import { translate } from "google-translate-api-x";
import Translation from "../models/Translation.js";

/**
 * 🧠 Smart name protector — handles multi-word names safely
 */
function protectNames(text) {
  const protectedNames = new Set();

  // Detect multi-word proper nouns (e.g., "Moshood Abiola Polytechnic")
  const multiWordRegex = /\b([A-Z][a-z]+(?:\s(?:[A-Z][a-z]+|of|and|the|Polytechnic|University|College)){1,4})\b/gi;
  let match;
  while ((match = multiWordRegex.exec(text)) !== null) {
    protectedNames.add(match[1].trim());
  }

  // Add lowercase known keywords (for institutions/places)
  const knownKeywords = [
    "polytechnic",
    "university",
    "college",
    "lagos",
    "abeokuta",
    "nigeria",
    "mapoly",
  ];
  knownKeywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    const found = text.match(regex);
    if (found) found.forEach((f) => protectedNames.add(f));
  });

  // Replace with ultra-safe placeholders
  let protectedText = text;
  const nameList = Array.from(protectedNames);
  nameList.forEach((name, index) => {
    // Use 🔒 to mark non-translatable placeholders
    const placeholder = `[[🔒NAME_${index}🔒]]`;
    protectedText = protectedText.replace(new RegExp(name, "gi"), placeholder);
  });

  return { protectedText, nameList };
}

/**
 * 🧩 Restore placeholders after translation
 */
function restoreNames(translatedText, nameList) {
  let restored = translatedText;
  nameList.forEach((name, index) => {
    const placeholder = new RegExp(`\\[\\[🔒NAME_${index}🔒\\]\\]`, "g");
    restored = restored.replace(placeholder, name);
  });
  return restored;
}

/**
 * 🚀 Main translation controller
 */
export const translateText = async (req, res) => {
  try {
    let { text, targetLanguage, sourceLanguage = "auto", userId = null } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    // Step 1: Protect names before translation
    const { protectedText, nameList } = protectNames(text);

    // Step 2: Perform translation
    const result = await translate(protectedText, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    // Step 3: Restore names
    const translatedText = restoreNames(result.text, nameList);

    // Step 4: Save to DB (optional)
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

    // Step 5: Return response
    return res.json({
      translatedText,
      detectedSourceLanguage: result.from.language.iso,
    });
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return res.status(500).json({ error: "Translation failed" });
  }
};
