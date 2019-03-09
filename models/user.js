const bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            isUrl: true
        },
        wins: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        losses: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    // Before a User is created, automatically hash password
    User.addHook('beforeCreate', function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    // Add foreign key BetId to User
    User.associate = function(models) {
        User.hasMany(models.Bet);
    }

    // Method to check if password entered is correct
    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };


    return User;
};