// src/system/database/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize(process.env.DB_URI || 'sqlite::memory:');
const db = {};

const modelsPath = path.join(__dirname);
fs.readdirSync(modelsPath).forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
        db[model.name] = model;
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
