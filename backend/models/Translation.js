import mongoose from "mongoose";

const TranslationSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true }, // optional; useful if you add auth later
    original: { type: String, required: true },
    translated: { type: String, required: true },
    sourceLanguage: { type: String },      // detected or provided
    targetLanguage: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Translation", TranslationSchema);
