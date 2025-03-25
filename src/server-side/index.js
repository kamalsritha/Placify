import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes.js/user.js";

const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000", 
  "https://placify-rho.vercel.app"  
];


app.use(cors({
  origin: function(origin, callback){
   
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", UserRouter);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connection Successful");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);  
  }
};


const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();