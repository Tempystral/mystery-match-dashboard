import express from "express";
import { body } from "express-validator";
import sheets from "../services/sheetsService.js";
import database from "../services/database.js";

const router = express.Router();

// TODO Expand these to take query params for filtering
// TODO Write methods to package and unpackage data more effectively

/* The issue I'm having right now is that I want to use a player's score returned from a query to populate a field in the match editing panel.
Except not every player has a score, and only some have scores for that match.
I need to de-associate the edited value from the list of players and create new refs for the scores. I also want to de-duplicate the player data, since I need
to pull all players in for the match player selection list anyways. So I'll simply initialize a match editing form with the SCORES existing, if any, on the match,
and that means looking up the player by ID. I don't want to search by property, that's slow and takes O(4n) time for 4 players. Linear but still not ideal.

By returning an object with player ID keys corresponding to player values, I spend O(n) populating the object during the fetch,
then O(1) x4 looking up four players by ID in the client. It also makes my data easier to search in general. */

/**
 * Retrieves a list of players.
 * Returns type PlayerResponseGroup
 */
router.get("/", async (req, res, next) => {
  const players = await database.getPlayers();
  res.send(players);
});

/* // This is only for now - this should be replaced by an API that can accept arbitrary values via URL parameters
router.get("/partial", async (req, res, next) => {
  const players = await database.getPartialPlayers({ extras: true });
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
router.patch("/", body("value.player_id").exists({ values: "falsy" }).isUUID(), async (req, res, next) => {
  const { player_id, player }: { player_id: string; player: UpdateValues<Player> } = req.body;
  const result = await database.updatePlayer(player_id, player);
  if (!result) {
    return res.status(500).send(`Could not update player with id ${player_id}`);
  }
  return res.status(200).send(result);
});
*/
// Import
router.get("/import", async (req, res, next) => {
  const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
  await sheets.buildPlayers(doc);
  res.sendStatus(200);
});

export default router;
