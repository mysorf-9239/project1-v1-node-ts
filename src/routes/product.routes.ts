import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controller/product.controller';

const router = Router();

// 1. **Lấy tất cả sản phẩm**
router.get('/', getAllProducts);

// 2. **Lấy một sản phẩm cụ thể**
router.get('/:productId', getProductById);

// 3. **Tạo sản phẩm mới**
router.post('/', createProduct);

// 4. **Chỉnh sửa sản phẩm**
router.put('/:productId', updateProduct);

// 5. **Xoá sản phẩm**
router.delete('/:productId', deleteProduct);

export default router;
