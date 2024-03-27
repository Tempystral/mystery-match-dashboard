import express from "express";
import sheets from "../services/sheetsService.js";
import * as database from "../services/dbService.js";
import { Match } from "../../../data/models.js";
import { Attributes, UpdateValues, ValidationError } from "@sequelize/core";
import { body } from "express-validator";

const router = express.Router();

// Get matches
router.get("/", async (req, res, next) => {
  const matches = await database.getMatches({ extras: true });
});

// Search matches
router.post("/search", async (req, res, next) => {});

// Add match
router.post("/", body().isObject(), async (req, res, next) => {
  const result = await database.createMatch(req.body);
  if (result instanceof Match) {
    return res.status(200).send(result);
  } else if (result instanceof ValidationError) {
    return res.status(400).send({ message: result.message });
  } else {
    return res.status(500).send({ message: result.message });
  }
});

/**
 * Updates a match.
 * Request:
 *   {
 *     id: string
 *     fields: UpdateValues<Match>
 *   }
 */
router.patch("/", body("value.match_id").exists({ values: "falsy" }).isUUID(), async (req, res, next) => {
  const [id, fields]: [string, UpdateValues<Match>] = req.body;
  const [affectedRows] = await database.updateMatch(id, fields);
  if (affectedRows < 1) {
    return res.status(500).send("Could not update rows!");
  } else if (affectedRows > 1) {
    return res.status(500).send("What the fuck did you do");
  }
  return res.status(200);
});

// Import
router.get("/import", async (req, res, next) => {
  const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
  await sheets.buildMatches(doc);
  res.sendStatus(200);
});

export default router;