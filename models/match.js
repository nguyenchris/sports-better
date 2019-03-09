module.exports = function(sequelize, DataTypes) {
    const Match = sequelize.define('Match', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        playedStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        winningTeamName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        winningTeamId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        startTime: {
            type: DataTypes.DATE(6),
            allowNull: false
        },
        awayScoreTotal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        homeScoreTotal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        homeTeamId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        awayTeamId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        checkGame: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    // Add foreign key UserId to Bets
    Match.associate = function(models) {
        Match.hasMany(models.Bet);
    };

    return Match;
};
