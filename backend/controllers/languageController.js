import fetch from "node-fetch";

export const getLanguages = async (_req, res) => {
  try {
    const response = await fetch("https://libretranslate.com/languages");
    const data = await response.json();

    // Convert into standard format for frontend
    const langs = data.map((lang) => ({
      code: lang.code,
      name: lang.name,
    }));

    // Add "auto" detection option manually
    langs.unshift({ code: "auto", name: "Auto Detect" });

    return res.json(langs);
  } catch (err) {
    console.error("❌ Language fetch error:", err.message);
    return res.status(500).json({ error: "Failed to load languages" });
  }
};
