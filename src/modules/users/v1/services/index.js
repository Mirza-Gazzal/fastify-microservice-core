// src/modules/users/v1/services/index.js

const axios = require("axios");
module.exports = (repository) => {
    return {
        list: async (query = {}) => {
            return repository.findAll(query);
        },
        create: async (data) => {
            return repository.create(data);
        },
        update: async (id, data) => {
            return repository.update(id, data);
        },
        delete: async (id) => {
            return repository.delete(id);
        },
        get: async (id) => {
            return repository.findById(id);
        },
        async  searchByName(name) {
            return repository.findByNameFragment(name);
        },

      

        
       

    };



};


























