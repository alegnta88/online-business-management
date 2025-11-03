import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './config/env.js';
import { connectCloudinary } from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import morgan from 'morgan';
import productRouter from './routes/productRoute.js';

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
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

app.get('/', (req, res) => {
    res.send('E-commerce API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

connectToDatabase();


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});