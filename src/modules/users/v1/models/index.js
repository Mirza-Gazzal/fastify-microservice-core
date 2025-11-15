

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING },
        name2: { type: DataTypes.STRING },
    });

    // Example of optional associations (if you have related models)
    User.associate = (models) => {
        // Example: User.hasMany(models.Post);
    };

    return User;
};