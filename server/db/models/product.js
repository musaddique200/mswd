const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    parent_sku: mongoose.Schema.Types.ObjectId,
    product_types: [String],
    title: String,
    category: String,
    created: Date,
    channels: [String]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;