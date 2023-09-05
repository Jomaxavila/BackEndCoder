import mongoose, { Schema } from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
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
        enum:["pending","rejected","completed"], // Corregí el typo en "rejected"
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

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;
