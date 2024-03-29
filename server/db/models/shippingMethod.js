const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
    shipping_id: Number,
    shipping_provider: String,
    source_id: Number,
    status: String,
    cost: Number
});

const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);
module.exports = ShippingMethod;