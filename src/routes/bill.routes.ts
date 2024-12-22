import { Router } from 'express';
import {
    getAllBills,
    getBillsByUserId,
    getBillsByUserIdAndDeviceId,
    getBillById,
    createBill,
    deleteBill,
} from '../controller/bill.controller';

const router = Router();

// 1. **Lấy tất cả hóa đơn**
router.get('/', getAllBills);

// 2. **Lấy tất cả hóa đơn của userId cụ thể**
router.get('/user', getBillsByUserId);

// 3. **Lấy tất cả hóa đơn của deviceId, userId cụ thể**
router.get('/device/:deviceId', getBillsByUserIdAndDeviceId);

// 4. **Lấy hóa đơn cụ thể theo billId**
router.get('/:billId', getBillById);

// 5. **Tạo hóa đơn mới**
router.post('/', createBill);

// 6. **Xóa hóa đơn**
router.delete('/:billId', deleteBill);

export default router;
