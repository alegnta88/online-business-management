import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './config/env.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import morgan from 'morgan';
import productRouter from './routes/productRoute.js';
import multer from './middleware/multer.js';

dotenv.config();


// app config
const app = express();
const PORT = process.env.PORT || 5000;
connectCloudinary();


// middlewares
app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

//api endpoints
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

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