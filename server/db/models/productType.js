const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    available: Boolean,
    stock: Number,
    price: Object,
    description: String,
    dimensions: Object,
    images: [String],
    created: Date,
    updated: Date
});

const ProductType = mongoose.model('ProductType', productTypeSchema);
module.exports = ProductType;