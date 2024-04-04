import { UpdateValues, ValidationError } from "@sequelize/core";
import express from "express";
import { body } from "express-validator";
import { Player } from "../../data/models.js";
import * as database from "../services/dbService.js";
import sheets from "../services/sheetsService.js";

const router = express.Router();

// Get players
router.get("/", async (req, res, next) => {
  const players = await database.getPlayers({ extras: true });
  res.send(players);
});

// Search players
router.post("/", async (req, res, next) => {
  res.send(req.body);
});

// Add players
router.put("/", body().isObject(), async (req, res, next) => {
  const result = await database.createPlayer(req.body);
  if (result instanceof Player) {
    return res.status(200).send(result);
  } else if (result instanceof ValidationError) {
    return res.status(400).send({ message: result.message });
  } else {
    return res.status(500).send({ message: result.message });
  }
});

// Update player
router.patch("/", body("value.player_id").exists({ values: "falsy" }), async (req, res, next) => {
  const { player_id, player }: { player_id: string; player: UpdateValues<Player> } = req.body;
  const result = await database.updatePlayer(player_id, player);
  if (!result) {
    return res.status(500).send(`Could not update player with id ${player_id}`);
  }
  return res.status(200).send(result);
});

// Import
router.get("/import", async (req, res, next) => {
  const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
  await sheets.buildPlayers(doc);
  res.sendStatus(200);
});

export default router;
