
const BaseRepository = require('../../../../system/database/repositories/base-repository');

class UserRepository extends BaseRepository {

    constructor(model) {

        // in some cases we can add some logic before sending the model the  base-repo
        super(model);

    }

    async findByEmail(email) {
        try {
            const user = await this.model.findOne({
                where: { email },
                attributes: ['id', 'email', 'password', 'first_name', 'last_name'],
            });
            return user;
        } catch (error) {
            console.error('Error in auth.repository.findByEmail:', error);
            throw error;
        }
    }


    async getUuidId(id){
        try {
            const user = await this.model.findOne({
                where: { id },
                attributes: ['id', 'email', 'password', 'first_name', 'last_name'],
            });
            return user;
        } catch (error) {
            console.error('Error in auth.repository.getUuidId', error);
            throw error;
        }

    }


    async login (data){

    }







}

module.exports = (model) => new UserRepository(model);