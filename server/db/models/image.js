const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    source: String,
    label: String
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;