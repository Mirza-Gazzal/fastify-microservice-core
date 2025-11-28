
//Postgres DB Connector using sequelizer 

const fp = require('fastify-plugin');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const schemaManager = require('../../database/utils/pg/schema-manager');
const schema = new schemaManager();

// Configuration for database (from .env or config)
const dbConfig = require('../postgres/config').postgres;

async function dbConnector(fastify, options) {
    _sys.logger.always("=====================================db conneter")
    // Initialize Sequelize instance
    const sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig.options
    );

    try {
        // Authenticate the connection
        _sys.logger.always('==============================DB plugin: before authenticate');
                _sys.logger.always('==============================DB plugin: before authenticate=========================');

        await sequelize.authenticate();
      //  fastify.log.info('==> PostgresSQL connection authenticated');
      _sys.logger.always('=================================DB plugin: after authenticate');


        // 1. Dynamically load models from the `/models` directory (excluding index.js)
        const models = {};


        //  Look for every 'index.js' under 'src/models/**/models/'
        const modelPaths = glob.sync('modules/*/v1/models/', {
            cwd: path.resolve(__dirname, '../../../'),
            absolute: true,
        });


        for (const modelPath of modelPaths) {
            const modelDefiner = require(modelPath);
            const model = modelDefiner(sequelize, DataTypes);
            models[model.name] = model;


        }


        // 2. Apply associations (if they exist)
        Object.values(models).forEach((model) => {
            if (typeof model.associate === 'function') {
                model.associate(models);
            }
        });

/**
 * schema control section -- migration control --
 *  edit the .env file under (postgres Schema manager) to activate the need option
 *  editing tables must be only in DEV mode only to test all the new updates before moving to production mode that why we are protecting the functionality with NODE_ENV
 * **/

        // Optionally sync the DB (can be controlled based on environment) schema manager actions
        if (process.env.NODE_ENV === 'DEV') {
            //   await sequelize.sync({ alter: true });// Alters existing tables to match the model structure ( if any problem use direct access)
            //await sequelize.sync({ force: true });// drops all tables ( if any problem use direct access)


            if (process.env.PG_ALLOW_SCHEMA_SYNC=== 'true') { //update from .env file
                await schema.UpdateAllSchemas(sequelize);// Alters existing tables to match the model structure
            }


            if (process.env.PG_DROP === 'true') { //update from .env file
                await schema.dropAllTables(sequelize);// drops all tables
            }




        }
        else{
            console.log('check ENV in ps-db-connector..')
        }




        //  Log all available model names (for debugging)
        _sys.logger.log('✅ Available models:', Object.keys(models));

        // 3. Decorate Fastify instance with Sequelize instance and models
        fastify.decorate('db', {
            sequelize,
            models,
        });

        _sys.logger.log('✅ PG Database connected successfully');
       return sequelize;
    } catch (error) {
        fastify.log.error('❌ Database connection failed:', error);
        throw error;
    }
}





module.exports = fp(dbConnector);