// require("dotenv").config({ path: `./src/.env` });
/*import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";*/
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: `./src/.env` });

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(` ⚙️ app is listening on port${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection FAILD!!!", err);
    throw err;
  });

/*
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("error", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port${process.env.PORT}`);
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
})();
*/
