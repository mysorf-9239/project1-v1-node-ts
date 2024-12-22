import { Request, Response } from "express";
import Product from "../models/Product";

// 1. **Lấy tất cả sản phẩm**
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
};

// 3. **Tạo sản phẩm mới**
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !price) {
            res.status(400).json({ message: "Tên và giá sản phẩm là bắt buộc" });
            return;
        }

        const newProduct = await Product.create({ name, description, price });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error });
    }
};

// 4. **Chỉnh sửa sản phẩm**
export const updateProduct = async (req: Request, res: Response) => {
    try {
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
        console.error(error);
        res.status(500).json({ message: "Lỗi khi chỉnh sửa sản phẩm", error });
    }
};

// 5. **Xoá sản phẩm**
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
            return;
        }

        await product.destroy();
        res.status(200).json({ message: "Xoá sản phẩm thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xoá sản phẩm", error });
    }
};
