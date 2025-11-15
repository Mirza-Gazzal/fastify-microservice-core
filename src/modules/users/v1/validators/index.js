const Joi = require('joi');

const schemas = {
    list: Joi.object({
        limit: Joi.number().integer().min(1).max(100).default(20),
        offset: Joi.number().integer().min(0).default(0)
    }),

    get: Joi.object({
        id: Joi.number().integer().positive().required()
    }),

    create: Joi.object({
        name: Joi.string().min(3).max(50),
        email: Joi.string().email().required(),
       name2: Joi.string().min(3).max(50).required(),
       // password: Joi.string().min(8).required()
    }),

    update: Joi.object({
        name: Joi.string().min(3).max(50),
        email: Joi.string().email()
    }).or('name', 'email'),

    delete: Joi.object({
        id: Joi.number().integer().positive().required()
    }),

    searchByName:  Joi.object({
            name: Joi.string().min(1).required()
        }),

    generateOTP:  Joi.object({
            phone: Joi.string()
                .pattern(/^[0-9]+$/)
                .min(10)
                .required()
                .messages({
                    'string.pattern.base': 'Phone must contain only digits',
                    'string.min': 'Phone must be at least 10 digits',
                    'string.empty': 'Phone is required',
                }),
        }),

    verifyOTP:  Joi.object({
            phone: Joi.string()
                .pattern(/^[0-9]+$/)
                .min(10)
                .required()
                .messages({
                    'string.pattern.base': 'Phone must contain only digits',
                    'string.min': 'Phone must be at least 10 digits',
                    'string.empty': 'Phone is required',
                }),
        otp: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(6)
            .max(6)
            .required()
            .messages({
                'string.pattern.base': 'OTP must contain only digits',
                'string.min': 'Phone must be  6 digits',
                'string.empty': 'OTP is required',
                'string.max': 'Phone must be  6 digits',
            }),
        }),



};

// Wrap validators in functions
module.exports = {
    list: (req, reply, done) => {
        const { error } = schemas.list.validate(req.query);
        if (error) return reply.respond().clientError('Validation error',{error});
        done();
    },
    get: (req, reply, done) => {
        const { error } = schemas.get.validate(req.params);
        if (error) return reply.respond().clientError('Validation error',{error});
        done();
    },
    create: (req, reply, done) => {
        const { error } = schemas.create.validate(req.body);
        if (error) return reply.respond().clientError('Validation error',{error});
        done();
    },
    update: (req, reply, done) => {
        const { error } = schemas.update.validate(req.body);
        if (error) return reply.respond().clientError('Validation error',{error});
        done();
    },
    delete: (req, reply, done) => {
        const { error } = schemas.delete.validate(req.params);
        if (error) return reply.respond().clientError('Validation error',{error});
        done();
    },

    //Costume api data validation example
    searchByName: (req, reply, done) => {
        const { error } = schemas.searchByName.validate(req.query);
        if (error) return reply.respond().clientError('Validation error',{error});
        done();
    },

    generateOTP: (req, reply, done) => {
        const { error } = schemas.generateOTP.validate(req.body);
        if (error)  return reply.respond().clientError('Validation error',{error});
        done();
    },

    verifyOTP: (req, reply, done) => {
        const { error } = schemas.verifyOTP.validate(req.body);
        if (error)   return reply.respond().clientError('Validation error',{error});
        done();
    },


};