// import mongoose from "mongoose";

import mongoose from "../../config/mongo.js";
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nome: String,
    email: String,
    senha: String,
  },
  {
    // # para adicionar data de criacao e atualizacao automaticamente
    timestamps: true,
  }
);

usuarioSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const usuarioModel = mongoose.model("usuarios", usuarioSchema);

export default usuarioModel;
