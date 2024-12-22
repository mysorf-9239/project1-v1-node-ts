import Menu from './Menu';
import Product from './Product';
import MenuProducts from './MenuProducts';
import Bill from "./Bill";
import BillProducts from "./BillProducts";
import User from "./User";

export const setupAssociations = () => {
    // Many-to-Many: Menu <-> Product thông qua MenuProducts
    Menu.belongsToMany(Product, {
        through: MenuProducts,
        foreignKey: 'menu_id',
        otherKey: 'product_id',
        as: 'products'
    });

    Product.belongsToMany(Menu, {
        through: MenuProducts,
        foreignKey: 'product_id',
        otherKey: 'menu_id',
        as: 'menus'
    });

    // Nếu bạn muốn truy cập trực tiếp từ MenuProducts đến Menu hoặc Product
    MenuProducts.belongsTo(Menu, { foreignKey: 'menu_id' });
    MenuProducts.belongsTo(Product, { foreignKey: 'product_id' });

    // Một User có thể có nhiều Bill
    User.hasMany(Bill, { foreignKey: 'user_id' });
    Bill.belongsTo(User, { foreignKey: 'user_id' });

    // Một Bill có thể chứa nhiều Product (thông qua BillProducts)
    Bill.belongsToMany(Product, { through: BillProducts, foreignKey: 'bill_id' });
    Product.belongsToMany(Bill, { through: BillProducts, foreignKey: 'product_id' });
};
