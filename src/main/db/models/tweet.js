"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tweet.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
      });
    }
  }
  Tweet.init(
    {
      message: { type: DataTypes.TEXT, allowNull: false },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "RESTRICT",
        references: { model: "Users", key: "id" },
      },
      noOfLikes: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    },
    {
      sequelize,
      modelName: "Tweet",
    }
  );
  return Tweet;
};
