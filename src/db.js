import mongoose from "mongoose";

const database = {
  connect: async () => {
    try {
      await mongoose.connect(
        `mongodb+srv://coder_55605:coder_55605@cluster0.fuyh6ix.mongodb.net/ecommerce`,{
          
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};

export default database;