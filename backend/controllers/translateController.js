import { translate } from "google-translate-api-x";
import Translation from "../models/Translation.js";

/**
 * 🧩 Smart function to detect and protect names & multi-word entities
 */
function smartProtectNames(text) {
  const protectedNames = new Set();

  // 1️⃣ Match sequences like "Moshood Abiola Polytechnic" or "University of Lagos"
  const multiWordRegex = /\b([A-Z][a-z]+(?:\s(?:[A-Z][a-z]+|of|and|the|Polytechnic|University|College)){1,4})\b/gi;
  let match;
  while ((match = multiWordRegex.exec(text)) !== null) {
    protectedNames.add(match[1].trim());
  }

  // 2️⃣ Detect single-word names that look like proper nouns
  const singleWordRegex = /\b[A-Z][a-z]{2,}\b/g;
  let singleMatch;
  while ((singleMatch = singleWordRegex.exec(text)) !== null) {
    protectedNames.add(singleMatch[0]);
  }

  // 3️⃣ Check for known educational or place keywords (even lowercase)
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

  // 4️⃣ Replace detected names with placeholders
  let protectedText = text;
  const nameList = Array.from(protectedNames);
  nameList.forEach((name, index) => {
    const placeholder = `__NAME_${index}__`;
    protectedText = protectedText.replace(new RegExp(name, "gi"), placeholder);
  });

  return { protectedText, nameList };
}

/**
 * 🔁 Restore protected names after translation
 */
function restoreNames(translatedText, nameList) {
  let restored = translatedText;
  nameList.forEach((name, index) => {
    const placeholder = new RegExp(`__NAME_${index}__`, "g");
    restored = restored.replace(placeholder, name);
  });
  return restored;
}

/**
 * 🚀 Main translator controller
 */
export const translateText = async (req, res) => {
  try {
    let { text, targetLanguage, sourceLanguage = "auto", userId = null } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "text and targetLanguage are required" });
    }

    // 🧠 Step 1: Smartly protect names
    const { protectedText, nameList } = smartProtectNames(text);

    // 🌐 Step 2: Perform translation
    const result = await translate(protectedText, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    // 🧩 Step 3: Restore names after translation
    let translatedText = restoreNames(result.text, nameList);

    // 💾 Step 4: Save translation (optional)
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

    // ✅ Step 5: Send back response
    return res.json({
      translatedText,
      detectedSourceLanguage: result.from.language.iso,
    });

  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return res.status(500).json({ error: "Translation failed" });
  }
};
