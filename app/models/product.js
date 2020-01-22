const mongoose = require("mongoose");

const product = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String
    },
    price: {
        type: Number
    }
})

module.exports = mongoose.model('Product', product);