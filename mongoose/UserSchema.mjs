import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
})

const CarSchema = ({
    brand: {
        type: String,
    },
    model: {
        type: Array
    }
})

export const UserModel = mongoose.model("carusers", UserSchema);
export const CarModel = mongoose.model("brandcars", CarSchema);