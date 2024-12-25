import { Request, Response } from 'express';
import Bill from '../models/Bill';
import User from '../models/User';
import Product from '../models/Product';
import BillProducts from '../models/BillProducts';

const middleware = (req: Request, res: Response) => {
    const role = req.user?.role;
    if (role !== 'admin') {
        res.status(403).json({ message: 'Forbidden.' });
        return true;
    }
    return false;
};

// 1. **Lấy tất cả hóa đơn**
export const getAllBills = async (req: Request, res: Response) => {
    try {
        if (middleware(req, res)) {
            return;
        }

        const bills = await Bill.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Product, as: 'products', through: { attributes: ['quantity'] } },
            ],
        });
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn', error });
    }
};

// 2. **Lấy tất cả hóa đơn của userId cụ thể**
export const getBillsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        const bills = await Bill.findAll({
            where: { user_id: userId },
            include: [{ model: Product, as: 'products', through: { attributes: ['quantity'] } },],
        });

        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy hóa đơn của người dùng', error });
    }
};

// 3. **Lấy tất cả hóa đơn của deviceId, userId cụ thể**
export const getBillsByUserIdAndDeviceId = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { deviceId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        const bills = await Bill.findAll({
            where: {
                user_id: userId,
                device_id: deviceId,
            },
            include: [{ model: Product, as: 'products', through: { attributes: ['quantity'] } },],
        });

        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy hóa đơn theo userId và deviceId', error });
    }
};

// 4. **Lấy hóa đơn cụ thể theo billId**
export const getBillById = async (req: Request, res: Response) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findByPk(billId, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Product, as: 'products', through: { attributes: ['quantity'] } },
            ],
        });

        if (!bill) {
            res.status(404).json({ message: 'Hóa đơn không tồn tại' });
            return;
        }

        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy hóa đơn', error });
    }
};

// 5. **Tạo hóa đơn mới**
export const createBill = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (userId === undefined) {
            res.status(400).json({ message: 'ID người dùng không hợp lệ' });
            return;
        }

        const { device_id, products } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        const newBill = await Bill.create({
            user_id: Number(userId),
            device_id,
            amount: 0,
        });

        const billProducts = [];
        let totalAmount: number = 0;

        for (let product of products) {
            const productFound = await Product.findByPk(product.product_id);
            if (!productFound) {
                res.status(400).json({ message: `Sản phẩm với ID ${product.product_id} không tồn tại` });
                return;
            }

            totalAmount += productFound.price * product.quantity;

            billProducts.push({
                bill_id: newBill.id,
                product_id: product.product_id,
                quantity: product.quantity,
            });
        }

        await BillProducts.bulkCreate(billProducts);

        newBill.amount = totalAmount;
        await newBill.save();

        const createdBill = await Bill.findByPk(newBill.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Product, as: 'products', through: { attributes: ['quantity'] } },
            ],
        });

        res.status(201).json(createdBill);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo hóa đơn', error });
    }
};

// 6. **Xóa hóa đơn**
export const deleteBill = async (req: Request, res: Response) => {
    try {
        if (middleware(req, res)) {
            return;
        }

        const { billId } = req.params;

        const bill = await Bill.findByPk(billId);
        if (!bill) {
            res.status(404).json({ message: 'Hóa đơn không tồn tại' });
            return;
        }

        await bill.destroy();
        res.status(200).json({ message: 'Xóa hóa đơn thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa hóa đơn', error });
    }
};
