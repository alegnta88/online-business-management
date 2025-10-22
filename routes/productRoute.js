import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js'


const productRouter = express.Router();

productRouter.post('/add', upload.single('image'), addProduct);
productRouter.delete('/remove', removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);

export default productRouter;