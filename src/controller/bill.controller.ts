import { Request, Response } from 'express';
import Bill from '../models/Bill';
import User from '../models/User';
import Product from '../models/Product';
import BillProducts from '../models/BillProducts';

// 1. **Lấy tất cả hóa đơn**
export const getAllBills = async (req: Request, res: Response) => {
    try {
        const bills = await Bill.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Product, through: { attributes: ['quantity'] } },
            ],
        });
        res.status(200).json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn', error });
    }
};

// 2. **Lấy tất cả hóa đơn của userId cụ thể**
export const getBillsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        const bills = await Bill.findAll({
            where: { user_id: userId },
            include: [{ model: Product, through: { attributes: ['quantity'] } }],
        });

        res.status(200).json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy hóa đơn của người dùng', error });
    }
};

// 3. **Lấy tất cả hóa đơn của deviceId, userId cụ thể**
export const getBillsByUserIdAndDeviceId = async (req: Request, res: Response) => {
    try {
        const { userId, deviceId } = req.params;

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
            include: [{ model: Product, through: { attributes: ['quantity'] } }],
        });

        res.status(200).json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy hóa đơn theo userId và deviceId', error });
    }
};

// 4. **Lấy hóa đơn cụ thể theo billId**
export const getBillById = async (req: Request, res: Response) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findByPk(billId, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Product, through: { attributes: ['quantity'] } },
            ],
        });

        if (!bill) {
            res.status(404).json({ message: 'Hóa đơn không tồn tại' });
            return;
        }

        res.status(200).json(bill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy hóa đơn', error });
    }
};

// 5. **Tạo hóa đơn mới**
export const createBill = async (req: Request, res: Response) => {
    try {
        const { userId, device_id, products } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        const newBill = await Bill.create({
            user_id: userId,
            device_id,
            amount: 0,
        });

        const billProductsData = products.map((product: any) => ({
            bill_id: newBill.id,
            product_id: product.productId,
            quantity: product.quantity,
        }));

        await BillProducts.bulkCreate(billProductsData);

        newBill.amount = await newBill.calculateAmount();
        await newBill.save();

        const createdBill = await Bill.findByPk(newBill.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Product, through: { attributes: ['quantity'] } },
            ],
        });

        res.status(201).json(createdBill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tạo hóa đơn', error });
    }
};

// 6. **Xóa hóa đơn**
export const deleteBill = async (req: Request, res: Response) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findByPk(billId);
        if (!bill) {
            res.status(404).json({ message: 'Hóa đơn không tồn tại' });
            return;
        }

        await bill.destroy();
        res.status(200).json({ message: 'Xóa hóa đơn thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa hóa đơn', error });
    }
};
