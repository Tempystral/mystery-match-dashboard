import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import {
  AllowNull,
  Attribute,
  BelongsToMany,
  Default,
  PrimaryKey,
  Unique,
} from "@sequelize/core/decorators-legacy";
import { PlayerStatus, Round } from "./types.js";

export class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
  @Attribute(DataTypes.UUID)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Unique
  @AllowNull(false)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  declare twitch_name: string;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare twitch_alt?: string;

  @Attribute(DataTypes.STRING)
  declare discord_name: string;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare twitter_name?: string;

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  declare in_brackets: CreationOptional<boolean>;

  @Attribute(DataTypes.STRING)
  @Default(PlayerStatus.ACTIVE)
  declare status: CreationOptional<typeof PlayerStatus>;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare pronunciation_notes: string;
  @Attribute(DataTypes.STRING)
  @Default("")
  declare pronouns: string;
  @Attribute(DataTypes.STRING)
  @Default("")
  declare accessibility: string;
  @Attribute(DataTypes.STRING)
  @Default("")
  declare timezone: string;
  @Attribute(DataTypes.STRING)
  @Default("")
  declare availability: string;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare notes: string;

  @BelongsToMany(() => Match, {
    through: () => MatchPlayer,
    inverse: {
      as: "players",
    },
    throughAssociations: {
      fromSource: "playedMatches",
      fromTarget: "playersInMatches",
      toSource: "player",
      toTarget: "match",
    },
    sourceKey: "id",
    targetKey: "id",
  })
  declare matches?: NonAttribute<Match[]>;

  declare getMatches: BelongsToManyGetAssociationsMixin<Match>;
  declare setMatches: BelongsToManySetAssociationsMixin<Match, Match["id"]>;
  declare addMatch: BelongsToManyAddAssociationMixin<Match, Match["id"]>;
  declare addMatches: BelongsToManyAddAssociationsMixin<Match, Match["id"]>;
  declare removeMatch: BelongsToManyRemoveAssociationMixin<Match, Match["id"]>;
  declare removeMatches: BelongsToManyRemoveAssociationsMixin<Match, Match["id"]>;
  declare createMatch: BelongsToManyCreateAssociationMixin<Match>;
  declare hasMatch: BelongsToManyHasAssociationMixin<Match, Match["id"]>;
  declare hasMatches: BelongsToManyHasAssociationsMixin<Match, Match["id"]>;
  declare countMatches: BelongsToManyCountAssociationsMixin<Match>;
}

export class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
  @Attribute(DataTypes.UUID)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Unique
  @AllowNull(false)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @AllowNull(false)
  declare tournament: string;

  @Attribute(DataTypes.DATEONLY)
  @Default(DataTypes.NOW)
  @AllowNull(false)
  declare date: Date;

  @Attribute(DataTypes.TIME)
  @AllowNull(false)
  declare time: number;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare game: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare platform: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare gamemaster: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare round: typeof Round;

  @Attribute(DataTypes.INTEGER)
  declare length: number;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare vod: CreationOptional<string>;

  /** Declared by inverse relationship in {@link Match.matches} */
  declare players?: NonAttribute<Player[]>;
  declare getPlayers: BelongsToManyGetAssociationsMixin<Player>;
  declare setPlayers: BelongsToManySetAssociationsMixin<Player, Player["id"]>;
  declare addPlayer: BelongsToManyAddAssociationMixin<Player, Player["id"]>;
  declare addPlayers: BelongsToManyAddAssociationsMixin<Player, Player["id"]>;
  declare removePlayer: BelongsToManyRemoveAssociationMixin<Player, Player["id"]>;
  declare removePlayers: BelongsToManyRemoveAssociationsMixin<Player, Player["id"]>;
  declare createPlayer: BelongsToManyCreateAssociationMixin<Player>;
  declare hasPlayer: BelongsToManyHasAssociationMixin<Player, Player["id"]>;
  declare hasPlayers: BelongsToManyHasAssociationsMixin<Player, Player["id"]>;
  declare countPlayers: BelongsToManyCountAssociationsMixin<Player>;
}

export class MatchPlayer extends Model<InferAttributes<MatchPlayer>, InferCreationAttributes<MatchPlayer>> {
  @Attribute(DataTypes.UUID)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Unique
  @AllowNull(false)
  declare id: CreationOptional<string>;

  declare playerId: NonAttribute<string>;
  declare matchId: NonAttribute<string>;

  @Attribute(DataTypes.STRING)
  @AllowNull(true)
  declare score: string;

  declare getMatch: BelongsToGetAssociationMixin<Match>;
  declare getPlayer: BelongsToGetAssociationMixin<Player>;
}
