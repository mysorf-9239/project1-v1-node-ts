import { Router } from 'express';
import verifyToken from '../middleware/verifyToken';
import {
    getAllUsers,
    createUser,
    checkUser,
    updatePassword,
    updateName
} from '../controller/userController';

const router = Router();

// 1. Lấy tất cả user
router.get('/', verifyToken, getAllUsers);

// 2. Đăng ký
router.post('/signup', createUser);

// 3. Đăng nhập
router.post('/login', checkUser);

// 4. Đổi mật khẩu
router.put('/password', verifyToken, updatePassword);

// 5. Đổi tên
router.put('/name', verifyToken, updateName);

export default router;
