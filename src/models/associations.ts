import Menu from './Menu';
import Product from './Product';
import MenuProducts from './MenuProducts';
import Bill from './Bill';
import BillProducts from './BillProducts';
import User from './User';

export const setupAssociations = () => {
    // 📝 **Many-to-Many: Menu <-> Product (MenuProducts)**
    Menu.belongsToMany(Product, {
        through: MenuProducts,
        foreignKey: 'menu_id',
        otherKey: 'product_id',
        as: 'products',
    });

    Product.belongsToMany(Menu, {
        through: MenuProducts,
        foreignKey: 'product_id',
        otherKey: 'menu_id',
        as: 'menus',
    });

    // 📌 **Truy cập trực tiếp qua MenuProducts**
    MenuProducts.belongsTo(Menu, { foreignKey: 'menu_id', as: 'menu' });
    MenuProducts.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // 📝 **One-to-Many: User <-> Bill**
    User.hasMany(Bill, { foreignKey: 'user_id', as: 'bills' });
    Bill.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    // 📝 **Many-to-Many: Bill <-> Product (BillProducts)**
    Bill.belongsToMany(Product, {
        through: BillProducts,
        foreignKey: 'bill_id',
        otherKey: 'product_id',
        as: 'products',
    });

    Product.belongsToMany(Bill, {
        through: BillProducts,
        foreignKey: 'product_id',
        otherKey: 'bill_id',
        as: 'bills',
    });

    // 📌 **Truy cập trực tiếp qua BillProducts**
    BillProducts.belongsTo(Bill, { foreignKey: 'bill_id', as: 'bill' });
    BillProducts.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
};
