import mongoose, { Schema, SchemaType } from "mongoose";

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        default: 5,
    },
});

export const CityModel = mongoose.model("City", citySchema);
