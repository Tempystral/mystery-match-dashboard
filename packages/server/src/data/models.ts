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
  ForeignKey,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Attributes,
} from "@sequelize/core";
import {
  AllowNull,
  Attribute,
  BelongsToMany,
  ColumnName,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from "@sequelize/core/decorators-legacy";
import { NotEmpty } from "@sequelize/validator.js";
import { Outcome, PlayerStatus, Round } from "@mmd/common";

export class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
  @Attribute(DataTypes.UUID)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Unique
  @NotNull
  @NotEmpty
  declare player_id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  @NotEmpty
  declare twitch_name: string;

  @Attribute(DataTypes.STRING)
  declare twitch_alt?: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @NotEmpty
  declare discord_name: string;

  @Attribute(DataTypes.STRING)
  declare twitter_name?: string;

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  declare in_brackets: CreationOptional<boolean>;

  @Attribute(DataTypes.STRING)
  @Default(PlayerStatus.ACTIVE)
  declare status: CreationOptional<PlayerStatus>;

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

  @Attribute(DataTypes.VIRTUAL(DataTypes.INTEGER, ["twitch_name"]))
  get total_score(): NonAttribute<number> {
    const scores = this.matches?.flatMap((m) => m["Score"]) ?? [];
    return (
      scores.reduce((acc, curr) => {
        return Number(curr?.points) ? acc + Number(curr?.points) : 0;
      }, 0) ?? 0
    );
  }

  @BelongsToMany(() => Match, {
    through: () => Score,
    inverse: {
      as: "players",
    },
    throughAssociations: {
      fromSource: "scores",
      fromTarget: "playerScores",
      toSource: "player",
      toTarget: "match",
    },
    sourceKey: "player_id",
    targetKey: "match_id",
    foreignKey: { name: "player_id", columnName: "player_id" },
    otherKey: { name: "match_id", columnName: "match_id" },
  })
  declare matches?: NonAttribute<Match[]>;

  @HasMany(() => Score, {
    sourceKey: "player_id",
    foreignKey: { name: "player_id", columnName: "player_id", allowNull: false },
  })
  declare scores?: NonAttribute<Score[]>;

  declare getMatches: BelongsToManyGetAssociationsMixin<Match>;
  declare setMatches: BelongsToManySetAssociationsMixin<Match, Match["match_id"]>;
  declare addMatch: BelongsToManyAddAssociationMixin<Match, Match["match_id"]>;
  declare addMatches: BelongsToManyAddAssociationsMixin<Match, Match["match_id"]>;
  declare removeMatch: BelongsToManyRemoveAssociationMixin<Match, Match["match_id"]>;
  declare removeMatches: BelongsToManyRemoveAssociationsMixin<Match, Match["match_id"]>;
  declare createMatch: BelongsToManyCreateAssociationMixin<Match>;
  declare hasMatch: BelongsToManyHasAssociationMixin<Match, Match["match_id"]>;
  declare hasMatches: BelongsToManyHasAssociationsMixin<Match, Match["match_id"]>;
  declare countMatches: BelongsToManyCountAssociationsMixin<Match>;

  declare getScores: HasManyGetAssociationsMixin<Score>;
}

export class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
  @Attribute(DataTypes.UUID)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Unique
  @NotNull
  @NotEmpty
  declare match_id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  @NotEmpty
  declare tournament: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare date: Date;

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
  declare round: Round;

  @Attribute(DataTypes.INTEGER)
  @Default(1)
  declare length: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare vod: CreationOptional<string>;

  /** Declared by inverse relationship in {@link Match.matches} */
  declare players?: NonAttribute<Player[]>;
  declare getPlayers: BelongsToManyGetAssociationsMixin<Player>;
  declare setPlayers: BelongsToManySetAssociationsMixin<Player, Player["player_id"]>;
  declare addPlayer: BelongsToManyAddAssociationMixin<Player, Player["player_id"]>;
  declare addPlayers: BelongsToManyAddAssociationsMixin<Player, Player["player_id"]>;
  declare removePlayer: BelongsToManyRemoveAssociationMixin<Player, Player["player_id"]>;
  declare removePlayers: BelongsToManyRemoveAssociationsMixin<Player, Player["player_id"]>;
  declare createPlayer: BelongsToManyCreateAssociationMixin<Player>;
  declare hasPlayer: BelongsToManyHasAssociationMixin<Player, Player["player_id"]>;
  declare hasPlayers: BelongsToManyHasAssociationsMixin<Player, Player["player_id"]>;
  declare countPlayers: BelongsToManyCountAssociationsMixin<Player>;

  @HasMany(() => Score, {
    sourceKey: "match_id",
    foreignKey: { name: "match_id", columnName: "match_id", allowNull: false },
  })
  declare scores?: NonAttribute<Score[]>;
  declare Score?: NonAttribute<Score>;

  declare getScores: HasManyGetAssociationsMixin<Score>;

  async setScore(p: Player | Player["player_id"], points: string) {
    const score = await Score.findOne({
      where: {
        match_id: this.match_id,
        player_id: p instanceof Player ? p.player_id : p,
      },
    });
    await score?.update("points", points);
  }
}

@Table({ timestamps: false })
export class Score extends Model<InferAttributes<Score>, InferCreationAttributes<Score>> {
  @Attribute(DataTypes.UUID)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Unique
  @AllowNull(false)
  declare score_id: CreationOptional<string>;

  declare player_id: ForeignKey<string>;

  declare match_id: ForeignKey<string>;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare points: string;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare outcome: Outcome;

  declare getMatch: BelongsToGetAssociationMixin<Match>;
  declare getPlayer: BelongsToGetAssociationMixin<Player>;
}
