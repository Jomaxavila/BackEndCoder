import mongoose, { Schema } from "mongoose";

const ordersCollection = "orders"

const ordersSchema = new mongoose.Schema({
    order_number:{
        type:String,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    status:{
        type:String,
        enum:["pending","rejectd","completed"],
        default: "pending"
    },
    products:[{
        reference:{ type:Schema.Types.ObjectId,    ref: 'products',    required:true },
        quantity: { type:Number , required: true,  default:1},
        price:{ type: Number , required:true}
    }],
    totalPrice:{
        type:Number,
        default:0
    }
})
const ordersModel = new mongoose.model(ordersCollection,ordersSchema)
export default ordersModel