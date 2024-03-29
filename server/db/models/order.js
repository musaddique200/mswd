const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: Number,
    created_at: Date,
    cost: Number,
    tax: Number,
    total: Number,
    paid: Boolean,
    currency: String,
    carts_id: Number
});

const Order = mongoose.model('Order', orderSchema);
module.exports =  Order;