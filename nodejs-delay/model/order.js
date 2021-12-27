let mongoose = require('mongoose');

let ordersSchema = new mongoose.Schema(
    {
        id: {type: Number},
        price: {type: Number},
        status: {type: Number}
    }
);

let Order = mongoose.model( 'orderlist2', ordersSchema );
module.exports = Order;
