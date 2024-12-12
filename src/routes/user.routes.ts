import {Router} from 'express';
import {authMiddleware} from "../middleware/auth";
import {
    getAllUsers,
    createUser,
    checkUser,
    updatePassword,
    updateName,
    checkDeviceId
} from '../controller/user.controller';

const router = Router();

// 1. Lấy tất cả user
router.get('/', authMiddleware, getAllUsers);

// 2. Đăng ký
router.post('/signup', createUser);

// 3. Đăng nhập
router.post('/login', checkUser);

// 4. Đổi mật khẩu
router.put('/password', authMiddleware, updatePassword);

// 5. Đổi tên
router.put('/name', authMiddleware, updateName);

// 6. Check device_id
router.put('/name', authMiddleware, checkDeviceId);

export default router;
