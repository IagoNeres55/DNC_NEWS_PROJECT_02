import mongoose from "mongoose";
const { Schema } = mongoose;

const noticiaSchema = new Schema(
  {
    titulo: String,
    img: String,
    texto: String,
    alt: String,
  },
  {
    timestamps: true,
  }
);

const noticiaModel = mongoose.model("noticias", noticiaSchema);

export default noticiaModel;
