import mongoose from "mongoose";
const { Schema } = mongoose;

const noticiaSchema = new Schema(
  {
    title: String,
    image: String,
    texto: String,
  },
  {
    timestamps: true,
  }
);

const noticiaModel = mongoose.model("noticias", noticiaSchema);

export default noticiaModel;
