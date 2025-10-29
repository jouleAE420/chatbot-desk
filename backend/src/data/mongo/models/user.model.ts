const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is requried"],
    },
    rol: {
        type: String,
        required: true,
        default: "monitRole",
        enum: ["superRole", "adminRole", "monitRole"],
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    state: {
        type: Boolean,
        default: true,
    },
    deviceToken: {
        type: Array,
        required: false,
        default: [],
    },
    parkings: {
        type: [Schema.Types.ObjectId],
        required: false,
        ref: "Parking",
        default: [],
    },
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

export const UserModel = model("User", UserSchema);
