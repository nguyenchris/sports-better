module.exports = function(sequelize, DataTypes) {
  const Bet = sequelize.define('Bet', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    selectedTeam: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });

  // Add foreign key UserId to Bets
  Bet.associate = function(models) {
    Bet.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  Bet.associate = function(models) {
    Bet.belongsTo(models.Match, {
      constraints: true,
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Bet;
};
