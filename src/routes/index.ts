import { Router } from 'express';
import userRoutes from './user.routes';
import menuRoutes from "./menu.routes";
import productRoutes from "./product.routes";
import billRoutes from './bill.routes';

const router = Router();

router.use('/menus', menuRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/bills', billRoutes);

export default router;
