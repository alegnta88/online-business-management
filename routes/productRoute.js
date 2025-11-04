import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';
import customerAuth from '../middleware/customerAuth.js';
import roleAuth from '../middleware/roleAuth.js';

const productRouter = express.Router();

productRouter.post('/add', userAuth, upload.single('image'), addProduct);
productRouter.delete('/remove', userAuth, removeProduct);
productRouter.post('/single', userAuth, singleProduct);
productRouter.get('/list', listProduct);

export default productRouter;