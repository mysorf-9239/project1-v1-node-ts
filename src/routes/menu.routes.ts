import { Router } from 'express';
import {
    getAllMenus,
    getMenuById,
    createMenu,
    addProductsToMenu,
    updateMenu,
    removeProductFromMenu,
    deleteMenu
} from '../controller/menu.controller';

const router = Router();

// 1. **Lấy tất cả menu**
router.get('/', getAllMenus);

// 2. **Lấy một menu cụ thể**
router.get('/:menuId', getMenuById);

// 3. **Tạo menu mới**
router.post('/', createMenu);

// 4. **Thêm sản phẩm vào menu**
router.post('/:menuId/products', addProductsToMenu);

// 5. **Chỉnh sửa menu**
router.put('/:menuId', updateMenu);

// 6. **Xoá sản phẩm khỏi menu**
router.delete('/:menuId/products/:productId', removeProductFromMenu);

// 7. **Xoá menu**
router.delete('/:menuId', deleteMenu);

export default router;
