import translate from "google-translate-api-x";

async function testTranslate() {
  try {
    const res = await translate("Bonjour", { from: "fr", to: "en" });
    console.log("Translated text:", res.text);
  } catch (err) {
    console.error("Error:", err);
  }
}

testTranslate();
