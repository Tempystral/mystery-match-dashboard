import { MatchSearchParams } from "@mmd/common";
import express, { Request } from "express";
import database from "../services/database.js";
import sheets from "../services/sheetsService.js";

const router = express.Router();

type MatchGetRequest = Request<{}, unknown, never, MatchSearchParams>;

// Get matches
router.get("/", async (req: MatchGetRequest, res, next) => {
  const { limit, ...params } = req.query;

  const matches = await database.getMatches(params, limit);
  res.send(matches);
});
/* 
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

router.patch("/", body("value.match_id").exists({ values: "falsy" }).isUUID(), async (req, res, next) => {
  const { match_id, match, players }: MatchUpdateRequest = req.body;
  await database.updateMatch(match_id, match);
  const result = await database.changeMatchPlayers(match_id, players.add, players.update, players.remove);
  // Could do with real error handling here
  if (!result) {
    return res.status(500).send(`Could not update match with id ${match_id}`);
  }
  return res.status(200).send(result);
}); */

// Import
router.get("/import", async (req, res, next) => {
  const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
  await sheets.buildMatches(doc);
  res.sendStatus(200);
});

export default router;
