import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';


const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.single('image'), addProduct);
productRouter.delete('/remove', adminAuth, removeProduct);
productRouter.post('/single', userAuth, singleProduct);
productRouter.get('/list', userAuth, listProduct);

export default productRouter;