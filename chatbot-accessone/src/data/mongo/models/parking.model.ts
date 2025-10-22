import mongoose, { Schema, SchemaType } from "mongoose";

const parkingSchema = new mongoose.Schema({
    city: {
        type: Schema.Types.ObjectId,
        ref: "city",
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        default: 5,
    },
});

export const ParkingModel = mongoose.model("Parking", parkingSchema);
