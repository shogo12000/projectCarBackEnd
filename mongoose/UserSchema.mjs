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

const CarSchema = new Schema({
    brand: {
        type: String,
    },
    model: {
        type: Array
    }
})

const AddCarSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String, // ou Number se quiser armazenar como número
      required: true,
      trim: true,
    },
    price: {
      type: String, // ou Number se quiser fazer cálculos com o valor
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // referência ao usuário que adicionou o carro
      required: true,
    },
  },
  { timestamps: true } // cria campos createdAt e updatedAt automaticamente
);

export const UserModel = mongoose.model("carusers", UserSchema);
export const CarModel = mongoose.model("brandcars", CarSchema);
export const AddCarModel = mongoose.model("allcars", AddCarSchema);