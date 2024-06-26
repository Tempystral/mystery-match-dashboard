import { MatchId, Outcome, PlayerId, PlayerStatus, Round, ScoreId } from "@mmd/common";
import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { UpdateDeleteAction, boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const UDActions = {
  onUpdate: "cascade" as UpdateDeleteAction,
  onDelete: "cascade" as UpdateDeleteAction,
};

export const playerStatus = pgEnum("status", Object.values<string>(PlayerStatus) as [string, ...string[]]);
export const round = pgEnum("round", Object.values<string>(Round) as [string, ...string[]]);
export const outcome = pgEnum("outcome", Object.values(Outcome) as [string, ...string[]]);

export const player = pgTable("player", {
  player_id: text("player_id")
    .$type<PlayerId>()
    .primaryKey()
    .$defaultFn(() => randomUUID().toString() as PlayerId),
  twitch_name: text("twitch_name").notNull(),
  twitch_alt: text("twitch_alt"),
  discord_name: text("discord_name").notNull(),
  twitter_name: text("twitter_name"),
  in_brackets: boolean("in_brackets").notNull().default(false),
  status: playerStatus("status").$type<PlayerStatus>().notNull().default(PlayerStatus.ACTIVE),
  pronunciation_notes: text("pronunciation_notes"),
  pronouns: text("pronouns"),
  accessibility: text("accessibility"),
  timezone: text("timezone"),
  availability: text("availability"),
  notes: text("notes"),
});

export const match = pgTable("match", {
  match_id: text("match_id")
    .$type<MatchId>()
    .primaryKey()
    .$defaultFn(() => randomUUID().toString() as MatchId),
  tournament: text("tournament").notNull().default(""),
  date: timestamp("date", { mode: "date", withTimezone: true }).notNull(),
  game: text("game"),
  platform: text("platform"),
  gamemaster: text("gamemaster"),
  round: round("round").$type<Round>().notNull().default(Round.UNKNOWN),
  length: integer("length").notNull().default(1),
  vod: text("vod"),
});

export const playerRelations = relations(player, ({ many }) => ({
  score: many(score),
}));

export const matchRelations = relations(match, ({ many }) => ({
  score: many(score),
}));

export const score = pgTable("score", {
  score_id: text("score_id")
    .$type<ScoreId>()
    .primaryKey()
    .$defaultFn(() => randomUUID().toString() as ScoreId),
  player_id: text("player_id")
    .notNull()
    .references(() => player.player_id, UDActions),
  match_id: text("match_id")
    .notNull()
    .references(() => match.match_id, UDActions),
  outcome: outcome("outcome").$type<Outcome>().notNull().default(Outcome.SCORE),
  points: integer("points").notNull().default(0),
});

export const scoreRelations = relations(score, ({ one }) => ({
  player: one(player, {
    fields: [score.player_id],
    references: [player.player_id],
  }),
  match: one(match, {
    fields: [score.match_id],
    references: [match.match_id],
  }),
}));
