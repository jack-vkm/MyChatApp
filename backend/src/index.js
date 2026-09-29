import express from 'express';
import dotenv from 'dotenv';
// import User from './models/user.model.js';
import { connectDB } from './lib/db.js';
import {clerkMiddleware} from '@clerk/express';

import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

import cors from 'cors';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ;
const publicDir = path.join(process.cwd(), 'public');


app.use(express.json());
app.use(cors({origin: FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "MyChatApp Backend Running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is healthy"
    });
});

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir));
    app.get("*",(req,res,next)=>{
        res.sendFile(path.join(publicDir, 'index.html'),(err)=>next(err));
    });
}

app.use(
  express.static(
    path.join(__dirname, "../../frontend/dist")
  )
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/dist/index.html")
  );
});

app.listen(PORT,()=>{
    connectDB();
    console.log('Server is running on port ' + PORT)
});