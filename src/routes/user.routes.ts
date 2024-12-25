import {Router} from 'express';
import {authMiddleware} from "../middleware/auth";
import {
    getAllUsers,
    createUser,
    checkUser,
    updatePassword,
    updateName,
    checkDeviceId, getUserWithId
} from '../controller/user.controller';

const router = Router();

// 1. Lấy tất cả user
router.get('/', authMiddleware, getAllUsers);

// 2. Đăng ký
router.post('/register', createUser);

// 3. Đăng nhập
router.post('/login', checkUser);

// 4. Đổi mật khẩu
router.put('/password', authMiddleware, updatePassword);

// 5. Đổi tên
router.put('/name', authMiddleware, updateName);

// 6. Check device_id
router.put('/device', authMiddleware, checkDeviceId);

// 7. Get user with id
router.get('/id', authMiddleware, getUserWithId);

export default router;
