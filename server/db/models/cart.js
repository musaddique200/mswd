const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    status: String,
    created_at: Date,
    expires: Date
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;