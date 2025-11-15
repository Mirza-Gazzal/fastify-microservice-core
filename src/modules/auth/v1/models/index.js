

module.exports = (sequelize, DataTypes) => {
    const Auth = sequelize.define('auth-user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [60, 100], // bcrypt hashes are 60+ characters
            },
        },

        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
/*
        tableName: 'users',
*/
        underscored: true,
        timestamps: true,          // adds created_at, updated_at
        paranoid: false,           // enable if you want soft deletes with deleted_at
    });
    // Example of optional associations (if you have related models)
    Auth.associate = (models) => {
        // Example: User.hasMany(models.Post);
    };

    return Auth;
};