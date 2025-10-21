import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectToDatabase from './config/env.js';



dotenv.config();


// app config
const app = express();
const PORT = process.env.PORT || 5000;


// middlewares
app.use(express.json());
app.use(cors());

//api routes
app.get('/', (req, res) => {
    res.send('E-commerce API is running...');
});


// log the server sunning status
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// connect to MongoDB
connectToDatabase();