declare const __brand: unique symbol;
declare const __base: unique symbol;

type Brand<Base, B> = {
  [__brand]: B;
  [__base]: Base;
};
export type Branded<Base, B> = Base & Brand<Base, B>;
export type BaseOf<T> = T extends Brand<infer Base, unknown> ? Base : never;

export type PlayerId = Branded<string, "PlayerId">;
export type MatchId = Branded<string, "MatchId">;
export type ScoreId = Branded<string, "ScoreId">;
