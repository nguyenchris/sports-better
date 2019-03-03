module.exports = function (sequelize, DataTypes) {
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
        }
    });
    return Bet;
};