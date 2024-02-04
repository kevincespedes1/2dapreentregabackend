  import mongoose from "mongoose";
  import mongoosePaginate from "mongoose-paginate-v2";

  const productsCollection = "products";

  const productSchema = new mongoose.Schema({
    status: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    unique: true, // Asegura que el campo 'code' sea único
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail:{
      type: String
    }
  });

  productSchema.plugin(mongoosePaginate);

  export const productModel = mongoose.model(productsCollection, productSchema);