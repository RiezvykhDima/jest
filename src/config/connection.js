const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://NicolaTesla:jwcomfortisbad19@cluster0.hvvtk.mongodb.net/test';
const MONGODB_DB_MAIN = 'users';
const MONGO_URI = `${MONGODB_URI}${MONGODB_DB_MAIN}`;

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

module.exports = mongoose.createConnection(MONGO_URI, connectOptions);
