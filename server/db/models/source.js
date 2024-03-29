const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({});

const Source = mongoose.model('Source', sourceSchema);
module.exports = Source;