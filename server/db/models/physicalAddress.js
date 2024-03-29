const mongoose = require('mongoose');

const physicalAddressSchema = new mongoose.Schema({
    user_id: Number,
    source_id: Number,
    street_number: Number,
    directional: String,
    street: String,
    suffix: String,
    unit_type: String,
    unit_number: Number,
    zip_code: String,
    country_code: String,
    primary: Boolean,
    active: Boolean,
    is_billing: Boolean,
    is_shipping: Boolean,
    is_warehouse: Boolean
});


const PhysicalAddress = mongoose.model('PhysicalAddress', physicalAddressSchema);
module.exports = PhysicalAddress;