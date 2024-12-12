import Menu from './Menu';
import Products from './Product';
import MenuProducts from './MenuProducts';

export const setupAssociations = () => {
    // Menu - Product: n-n
    Menu.belongsToMany(Products, {
        through: MenuProducts,
        foreignKey: 'menu_id',
        otherKey: 'product_id',
        as: 'products',
    });
    Products.belongsToMany(Menu, {
        through: MenuProducts,
        foreignKey: 'product_id',
        otherKey: 'menu_id',
        as: 'menus',
    });
};