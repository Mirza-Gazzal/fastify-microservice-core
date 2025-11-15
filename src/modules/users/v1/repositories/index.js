
const BaseRepository = require('../../../../system/database/repositories/base-repository');

class UserRepository extends BaseRepository {

    constructor(model) {

        // in some cases we can add some logic before sending the model the  base-repo
        super(model);

    }





}

module.exports = (model) => new UserRepository(model);