module.exports = {
    list: (req, reply, done) => {
        if (req.query.limit) req.query.limit = parseInt(req.query.limit, 10);
        if (req.query.offset) req.query.offset = parseInt(req.query.offset, 10);
        done();
    },

    get: (req, reply, done) => {
        req.params.id = parseInt(req.params.id, 10);
        done();
    },

    create: (req, reply, done) => {
        if (req.body.name) req.body.name = req.body.name.trim();
        if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
        if (req.body.name2) req.body.name2 = req.body.name2.trim();
        done();
    },

    update: (req, reply, done) => {
        req.params.id = parseInt(req.params.id, 10);
        if (req.body.name) req.body.name = req.body.name.trim();
        if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
        done();
    },

    delete: (req, reply, done) => {
        req.params.id = parseInt(req.params.id, 10);
        done();
    },

    //Costume api data sanitization example
    searchByName: (req, reply, done) => {
        if (req.query.name) req.query.name = req.query.name.trim().toLowerCase();
        done();
    },

    generateOTP: (req, reply, done) => {
        if (req.body.phone) req.body.phone = req.body.phone.trim();
        done();
    },
    verifyOTP: (req, reply, done) => {
        if (req.body.phone) req.body.phone = req.body.phone.trim();
        if (req.body.otp) req.body.otp = req.body.otp.trim();
        done();
    },


};