
/**
 * @module src/system/database/repositories/base-repository
 *
 * @Description base-repo main service API's and queries file, a dynamic base-repo file that all model's inside the service can use the same main CRUD and other function in a simple and dynamic way
 * and is flexible and easy to add query functions and use  support sequelize and sql query for now
 * we can use same base-repo fpr all models, or we can choose to separate  them by editing or main module repo file to route to other Model-base-repo
 * for more organizing and flexible control all base-repo files must be inside system/database/repository/file-name.js
 * those functions support all model in the hole service given example is on USER model
 *
 *
 */

const { Op } = require('sequelize');
class BaseRepository {
    constructor(model) {

        if (!model || typeof model.create !== 'function') {
            throw new Error('Sequelize model with .create() method was not provided');
        }
        this.model = model;
    }

    /**
     * Creating a new user .
     *
     * @async
     * @function create
     * @param {Object} data web request data
     * @returns {json} return if user is created or no
     */


    async create(data) {

        return this.model.create(data);
    }

    async findAll(query = {}) {
        return this.model.findAll({ where: query });
    }

    async findById(id) {
        return this.model.findByPk(id);
    }


    async update(id, data) {
        const instance = await this.model.findByPk(id);
        if (!instance) throw new Error('Record not found');
        return instance.update(data);
    }

    async delete(id) {
        const instance = await this.model.findByPk(id);
        if (!instance) throw new Error('Record not found');
        return instance.destroy();
    }



    async rawQuery(sql, options = {}) {
        if (!this.model?.sequelize) {
            throw new Error('Sequelize instance not found on model');
        }
        return this.model.sequelize.query(sql, options);
    }




    async findByNameFragment(nameFragment) { // sql query example if we could not use model methods if there is a complex query
        const sql = `
        SELECT id, name, email
        FROM "Posts"
        WHERE email LIKE '%${nameFragment}%'
       
    `;                                                                           //**** important ****
        const [results, metadata] = await this.rawQuery(sql);                   // here are two references of how to use the SQL queries and the sequelize model
        return results;
    }


    /*   async findByNameFragment(nameFragment) { // same findByNameFragment but these one is using sequelize model
        return this.model.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${nameFragment}%`
                }
            }
        });
    }
*/




}

module.exports = BaseRepository;
