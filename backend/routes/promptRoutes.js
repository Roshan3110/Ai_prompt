import express from "express";
import {
  getPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  reorderPrompts,
  importPrompts,
} from "../controllers/promptController.js";

const router = express.Router();

router.get("/", getPrompts);
router.post("/", createPrompt);
router.post("/import", importPrompts);
router.patch("/reorder", reorderPrompts);
router.get("/:id", getPromptById);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

export default router;
