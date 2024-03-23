import express from "express";
import sheets from "../services/sheetsService.js";
import { Match, Player } from "../../../data/models.js";

const router = express.Router();

// Get matches
router.get("/", async (req, res, next) => {
  const matches = await Match.findAll({ include: [Player] });
  res.send(matches);
});

// Search matches
router.post("/", async (req, res, next) => {});

// Add matches
router.put("/", async (req, res, next) => {});

// Import
router.get("/import", async (req, res, next) => {
  const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
  await sheets.buildMatches(doc);
  res.sendStatus(200);
});

export default router;
