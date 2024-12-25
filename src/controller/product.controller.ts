import { Request, Response } from "express";
import Product from "../models/Product";

const middleware = (req: Request, res: Response) => {
    const role = req.user?.role;
    if (role !== 'admin') {
        res.status(403).json({ message: 'Forbidden.' });
        return true;
    }
    return false;
};

// 1. **Lấy tất cả sản phẩm**
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
    }
};

// 2. **Lấy một sản phẩm cụ thể**
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
};

// 3. **Tạo sản phẩm mới**
export const createProduct = async (req: Request, res: Response) => {
    try {
        if (middleware(req, res)) {
            return;
        }

        const { name, description, image, price } = req.body;

        if (!name || !price) {
            res.status(400).json({ message: "Tên và giá sản phẩm là bắt buộc" });
            return;
        }

        if (image) {
            const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
            if (!base64Regex.test(image)) {
                res.status(400).json({ message: "Hình ảnh phải là chuỗi Base64 hợp lệ" });
                return;
            }

            const imageSize = Buffer.byteLength(image, 'utf-8');
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (imageSize > maxSize) {
                res.status(400).json({ message: "Hình ảnh vượt quá kích thước tối đa 2MB" });
                return;
            }
        }

        const newProduct = await Product.create({
            name,
            description,
            image: image || "#",
            price
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error });
    }
};

// 4. **Chỉnh sửa sản phẩm**
export const updateProduct = async (req: Request, res: Response) => {
    try {
        if (middleware(req, res)) {
            return;
        }

        const { productId } = req.params;
        const { name, description, price } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
            return;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi chỉnh sửa sản phẩm", error });
    }
};

// 5. **Xoá sản phẩm**
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        if (middleware(req, res)) {
            return;
        }

        const { productId } = req.params;

        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
            return;
        }

        await product.destroy();
        res.status(200).json({ message: "Xoá sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xoá sản phẩm", error });
    }
};