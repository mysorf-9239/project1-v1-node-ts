import {Sequelize} from 'sequelize';
import User from './User';
import Menu from './Menu';
import Products from './Product';
import MenuProducts from './MenuProducts';
import Bill from "./Bill";
import BillProducts from "./BillProducts";
import {setupAssociations} from './associations';

const models = {
    sequelize: Sequelize,
    User,
    Menu,
    Products,
    MenuProducts,
    Bill,
    BillProducts,
};

export const initModels = (sequelize: Sequelize) => {

    setupAssociations();
};

export default models;