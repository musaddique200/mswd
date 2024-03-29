const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user_id: Number,
    verification_token: String,
    payment_type: String,
    created_at: Date,
    amount: Number,
    currency: String,
    order_id: Number,
    billing_address_id: Number
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports =  Payment;