const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    type: String,
    label: String,
    price: Object,
    default: Boolean
});

const Option = mongoose.model('Option', optionSchema);
module.exports = Option;