import { Sequelize } from "@sequelize/core";
import { Match, MatchPlayer, Player } from "./models.js";

const sq = new Sequelize({
  database: "database",
  username: "user",
  password: "password",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
  models: [Player, Match, MatchPlayer],
});

export default sq;
