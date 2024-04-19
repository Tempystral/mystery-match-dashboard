/* export const Round = {
  GROUP_STAGE_R_1: "Group Stage, Round 1",
  GROUP_STAGE_R_2: "Group Stage, Round 2",
  GROUP_STAGE_R_3: "Group Stage, Round 3",
  GROUP_STAGE_R_4: "Group Stage, Round 4",
  TIEBREAKERS: "Tiebreakers",
  WINNERS_1: "Winners 1",
  WINNERS_2: "Winners 2",
  WINNERS_3: "Winners 3",
  WINNERS_4: "Winners 4",
  WINNERS_FINALS: "Winners Finals",
  LOSERS_1: "Losers 1",
  LOSERS_2: "Losers 2",
  LOSERS_3: "Losers 3",
  LOSERS_4: "Losers 4",
  LOSERS_5: "Losers 5",
  LOSERS_6: "Losers 6",
  LOSERS_7: "Losers 7",
  LOSERS_FINALS: "Losers Finals",
  GRAND_FINALS: "Grand Finals",
  GRAND_FINALS_RESET: "Grand Finals (Reset)",
  UNKNOWN: "Unknown",
} as const; */

export enum RoundType {
  GROUP_STAGE = "GROUP",
  BRACKETS = "BRCKT",
  EVENT = "EVENT",
}

export enum Round {
  GROUP_STAGE_R_1 = "GROUPR1",
  GROUP_STAGE_R_2 = "GROUPR2",
  GROUP_STAGE_R_3 = "GROUPR3",
  GROUP_STAGE_R_4 = "GROUPR4",
  TIEBREAKERS = "TIEBREAKERS",
  WINNERS_1 = "WINNERS1",
  WINNERS_2 = "WINNERS2",
  WINNERS_3 = "WINNERS3",
  WINNERS_4 = "WINNERS4",
  WINNERS_FINALS = "WINNERSF",
  LOSERS_1 = "LOSERS1",
  LOSERS_2 = "LOSERS2",
  LOSERS_3 = "LOSERS3",
  LOSERS_4 = "LOSERS4",
  LOSERS_5 = "LOSERS5",
  LOSERS_6 = "LOSERS6",
  LOSERS_7 = "LOSERS7",
  LOSERS_FINALS = "LOSERSF",
  GRAND_FINALS = "GRANDS",
  GRAND_FINALS_RESET = "GRANDSRESET",
  UNKNOWN = "UNKNOWN",
}

export const RoundLabel: { [key in Round]: string } = {
  [Round.GROUP_STAGE_R_1]: "Group Stage, Round 1",
  [Round.GROUP_STAGE_R_2]: "Group Stage, Round 2",
  [Round.GROUP_STAGE_R_3]: "Group Stage, Round 3",
  [Round.GROUP_STAGE_R_4]: "Group Stage, Round 4",
  [Round.TIEBREAKERS]: "Tiebreakers",
  [Round.WINNERS_1]: "Winners 1",
  [Round.WINNERS_2]: "Winners 2",
  [Round.WINNERS_3]: "Winners 3",
  [Round.WINNERS_4]: "Winners 4",
  [Round.WINNERS_FINALS]: "Winners Finals",
  [Round.LOSERS_1]: "Losers 1",
  [Round.LOSERS_2]: "Losers 2",
  [Round.LOSERS_3]: "Losers 3",
  [Round.LOSERS_4]: "Losers 4",
  [Round.LOSERS_5]: "Losers 5",
  [Round.LOSERS_6]: "Losers 6",
  [Round.LOSERS_7]: "Losers 7",
  [Round.LOSERS_FINALS]: "Losers Finals",
  [Round.GRAND_FINALS]: "Grand Finals",
  [Round.GRAND_FINALS_RESET]: "Grand Finals (Reset)",
  [Round.UNKNOWN]: "Unknown",
};

export enum PlayerStatus {
  ACTIVE = "ACTV",
  ELIMINATED = "ELIM",
  DROPPED_OUT = "DROP",
}
/* const statuses2 = {
  ACTIVE: "ACTV",
  ELIMINATED: "ELIM",
  DROPPED_OUT: "DROP"
} as const;
type Statuses3 = typeof statuses2[keyof typeof statuses2]; */

export const PlayerStatusLabel: { [key in PlayerStatus]: string } = {
  [PlayerStatus.ACTIVE]: "Active",
  [PlayerStatus.ELIMINATED]: "Eliminated",
  [PlayerStatus.DROPPED_OUT]: "Dropped Out",
};

export enum Outcome {
  SCORE = "SCORE",
  WIN = "WIN",
  LOSE = "LOSE",
  MULLIGAN = "MULL",
  DISQUALIFIED = "DQED",
  FORFEIT = "FRFT",
  ZOMBIE = "ZOMB",
  LIVING_DEAD = "LVDD",
}
