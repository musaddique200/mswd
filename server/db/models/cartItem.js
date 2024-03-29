const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    quantity: Number,
    discount: Number,
    price: Number,
    carts_id: Number,
    product_sku: Number
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;