import { Router } from "express";
import { getLanguages } from "../controllers/languageController.js";

const router = Router();
router.get("/", getLanguages);

export default router;
