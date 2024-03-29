const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    shipping_target_address_id: Number,
    order_id: Number,
    shipping_method: String,
    status: String
});

const Shipping = mongoose.model('Shipping', shippingSchema);
module.exports = Shipping;