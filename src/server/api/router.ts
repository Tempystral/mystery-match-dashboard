import { Router } from "express";
import { matchRouter, playerRouter } from "./routes/index.js";
import { bot } from "../setup.js";
import { Match, Score, Player } from "../../data/models.js";

const router = Router({ caseSensitive: true });

router.use("/players", playerRouter);
router.use("/matches", matchRouter);

router.get("/", (req, res) => {
  const body = `
  <div style="text-align: center">
    <h1>
      <a href="https://discordx.js.org">discord.ts</a> rest api server example
    </h1>
    <p>
      powered by <a href="https://koajs.com/">koa</a> and
      <a href="https://www.npmjs.com/package/@discordx/koa">@discordx/koa</a>
    </p>
  </div>
`;
  res.send(body);
});

router.get("/guilds", (req, res) => {
  res.send(`${bot.guilds.cache.map((g) => `${g.id}: ${g.name}`).join("\n")}`);
});

router.get("/clear", async (req, res) => {
  await Player.truncate();
  await Match.truncate();
  await Score.truncate();
  res.send("Cleared!");
});

export default router;
