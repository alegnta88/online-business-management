import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct} from '../controllers/productController.js'
import { upload } from '../middleware/multer.js'

const productRouter = express.Route();

productRouter.post('add', upload, addProduct);
productRouter.post('remove', removeProduct);
productRouter.post('single', singleProduct);
productRouter.get('/list', listProduct);

export default productRouter;