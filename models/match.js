module.exports = function(sequelize, DataTypes) {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    playedStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    winningTeamName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    winningTeamId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  // Add foreign key UserId to Bets
  Match.associate = function(models) {
    Match.hasMany(models.Bet, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Match;
};
