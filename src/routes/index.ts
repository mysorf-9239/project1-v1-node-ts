import {Router} from 'express';
import {authMiddleware} from "../middleware/auth";

import userRoutes from './user.routes';
import menuRoutes from "./menu.routes";
import productRoutes from "./product.routes";
import billRoutes from './bill.routes';

const router = Router();

router.use('/users', userRoutes);

router.use('/menus', authMiddleware, menuRoutes);

router.use('/products', authMiddleware, productRoutes);

router.use('/bills', authMiddleware, billRoutes);

export default router;
