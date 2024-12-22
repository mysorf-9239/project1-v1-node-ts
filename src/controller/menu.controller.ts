import { Request, Response } from "express";
import Menu from "../models/Menu";
import Product from "../models/Product";

const middleware = (req: Request, res: Response) => {
    const role = req.user?.role;
    if (role !== 'admin') {
        res.status(403).json({ message: 'Forbidden.' });
        return;
    }
}

// 1. **Lấy tất cả menu**
export const getAllMenus = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const menus = await Menu.findAll({ include: { model: Product, as: 'products' } });
        res.status(200).json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách menu", error });
    }
};

// 2. **Lấy một menu cụ thể**
export const getMenuById = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const { menuId } = req.params;

        const menu = await Menu.findByPk(menuId, { include: { model: Product, as: 'products' } });
        if (!menu) {
            res.status(404).json({ message: "Menu không tồn tại" });
            return;
        }

        res.status(200).json(menu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy menu", error });
    }
};

// 3. **Tạo menu mới**
export const createMenu = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ message: "Tên menu là bắt buộc" });
            return;
        }

        const newMenu = await Menu.create({ name, description });
        res.status(201).json(newMenu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo menu", error });
    }
};

// 4. **Thêm sản phẩm vào menu**
export const addProductsToMenu = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const { menuId } = req.params;
        const { productIds } = req.body;

        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            res.status(404).json({ message: "Menu không tồn tại" });
            return;
        }

        const products = await Product.findAll({ where: { id: productIds } });
        if (products.length === 0) {
            res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
            return;
        }

        await (menu as any).addProducts(products); // Sequelize Many-to-Many method
        res.status(200).json({ message: "Thêm sản phẩm vào menu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm vào menu", error });
    }
};

// 5. **Chỉnh sửa menu**
export const updateMenu = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const { menuId } = req.params;
        const { name, description } = req.body;

        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            res.status(404).json({ message: "Menu không tồn tại" });
            return;
        }

        menu.name = name || menu.name;
        menu.description = description || menu.description;
        await menu.save();

        res.status(200).json(menu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi chỉnh sửa menu", error });
    }
};

// 6. **Xoá sản phẩm khỏi menu**
export const removeProductFromMenu = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const { menuId, productId } = req.params;

        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            res.status(404).json({ message: "Menu không tồn tại" });
            return;
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
            return;
        }

        await (menu as any).removeProduct(product);
        res.status(200).json({ message: "Xoá sản phẩm khỏi menu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xoá sản phẩm khỏi menu", error });
    }
};

// 7. **Xoá menu**
export const deleteMenu = async (req: Request, res: Response) => {
    try {
        middleware(req, res);

        const { menuId } = req.params;

        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            res.status(404).json({ message: "Menu không tồn tại" });
            return;
        }

        await menu.destroy();
        res.status(200).json({ message: "Xoá menu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xoá menu", error });
    }
};
