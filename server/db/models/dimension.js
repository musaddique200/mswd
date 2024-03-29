const mongoose = require('mongoose');

const dimensionSchema = new mongoose.Schema({
    width: Number,
    height: Number,
    length: Number,
    unit: String
});

const Dimension = mongoose.model('Dimension', dimensionSchema);
module.exports = Dimension;