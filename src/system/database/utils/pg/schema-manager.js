
/**
 * @module src/system/database/utils/pg/schema-manager
 *
 * @Description PG schema manager is created for making migrations control easy and clear  these file can be updated any time by adding new functions that will help editing and controlling
 * the postgres database
 *
 * All existing function in this class are called and used from the main plug-in DB-connector look into plugins/postgres/ps-db-connector.js  schema control section line : 68
 *
 *
 **/


/**
 * @class
 * @classdesc Pg schema control class help us to update/drop tables.
 */
class schemaManager{

    async dropAllTables(sequelize) {
        try {
            _sys.logger.log('Dropping all tables...');
           await sequelize.drop({ cascade: true });
            _sys.logger.log('All tables dropped successfully!');
        } catch (err) {
            console.error('Error dropping tables:', err);
            throw err;
        }
    }

    async UpdateAllSchemas(sequelize) {
        try {
            _sys.logger.log('Updating  all PG schemas / tables...');
            await sequelize.sync({ alter: true });// Alters existing tables to match the model structure
            _sys.logger.log('All tables updated successfully!');
        } catch (err) {
            console.error('Error updating tables:', err);
            throw err;
        }
    }




}
module.exports = schemaManager;