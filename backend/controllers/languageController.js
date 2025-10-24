import { translate } from "google-translate-api-x";

export const getLanguages = async (_req, res) => {
  try {
    const langs = translate.languages;

    // Convert { en: 'English', fr: 'French' } → [{ code: "en", name: "English" }, ...]
    const data = Object.entries(langs).map(([code, name]) => ({
      code,
      name
    }));

    return res.json(data);
  } catch (err) {
    console.error("❌ Language fetch error:", err.message);
    return res.status(500).json({ error: "Failed to load languages" });
  }
};
