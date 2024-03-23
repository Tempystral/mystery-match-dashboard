import express from "express";
import sheets from "../services/sheetsService.js";
import { Match, Player } from "../../../data/models.js";

const router = express.Router();

// Get players
router.get("/", async (req, res, next) => {
  const players = await Player.findAll({ include: [Match] });
  res.send(players);
});

// Search players
router.post("/", async (req, res, next) => {
  res.send(req.body);
});

// Add players
router.put("/", async (req, res, next) => {});

// Import
router.get("/import", async (req, res, next) => {
  const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
  await sheets.buildPlayers(doc);
  res.sendStatus(200);
});

export default router;
