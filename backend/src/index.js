import express from 'express';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import { connectDB } from './lib/db.js';
import {clerkMiddleware} from '@clerk/express';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 3000;

app.use(express.json());
app.use(cors({origin: FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware());

app.get("./health",(req,res)=>{
    res.status(200).json({message:"Server is healthy"})
})


app.listen(PORT,()=>{
    connectDB();
    console.log('Server is running on port ' + PORT)
});