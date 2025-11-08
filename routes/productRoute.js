import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct, approveProduct, rejectProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';
import customerAuth from '../middleware/customerAuth.js';
import roleAuth from '../middleware/roleAuth.js';
import optionalAuth from '../middleware/optionalAuth.js';
import adminOrUserAuth from '../middleware/adminOrUserAuth.js';

const productRouter = express.Router();

productRouter.post('/add', adminOrUserAuth, upload.single('image'), addProduct);
productRouter.delete('/remove', userAuth, removeProduct);
productRouter.post('/single', userAuth, singleProduct);
productRouter.get('/list', optionalAuth, listProduct);

productRouter.put('/:id/approve', adminAuth, approveProduct);
productRouter.put('/:id/reject', adminAuth, rejectProduct);

export default productRouter;