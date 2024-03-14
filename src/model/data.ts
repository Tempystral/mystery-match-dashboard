enum Round {
  GROUP_STAGE_R_1 = "Group Stage, Round 1",
  GROUP_STAGE_R_2 = "Group Stage, Round 2",
  GROUP_STAGE_R_3 = "Group Stage, Round 3",
  GROUP_STAGE_R_4 = "Group Stage, Round 4",
  TIEBREAKERS = "Tiebreakers",
  WINNERS_1 = "Winners Round 1",
  WINNERS_2 = "Winners Round 2",
  WINNERS_3 = "Winners Round 3",
  WINNERS_4 = "Winners Round 4",
  WINNERS_FINALS = "Winners Finals",
  LOSERS_1 = "Losers Round 1",
  LOSERS_2 = "Losers Round 2",
  LOSERS_3 = "Losers Round 3",
  LOSERS_4 = "Losers Round 4",
  LOSERS_5 = "Losers Round 5",
  LOSERS_6 = "Losers Round 6",
  LOSERS_7 = "Losers Round 7",
  LOSERS_FINALS = "Losers Finals",
  GRAND_FINALS = "Grand Finals",
  GRAND_FINALS_RESET = "Grand Finals (Reset)",
}

type Player = {};

type KusograndeMatch = {
  date: Date;
  game: string;
  platform: string;
  gamemaster: string;
  players: string[];
  scores: number[];
  round: Round;
  length: number;
  vod: string;
};

export { type KusograndeMatch, type Player, Round };
