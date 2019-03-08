module.exports = function(sequelize, DataTypes) {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    winningTeam: {
      type: DataTypes.STRING,
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
