
const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    original: Number,
    discount: Number,
    bulk_discount: Number,
    discount_quantity: Number,
    currency: String
});

const Price = mongoose.model('Price', priceSchema);
module.exports = Price;