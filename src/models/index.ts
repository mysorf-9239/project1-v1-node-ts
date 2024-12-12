import {Sequelize} from 'sequelize';
import User from './User';
import Menu from './Menu';
import Products from './Product';
import MenuProducts from './MenuProducts';
import {setupAssociations} from './associations';

const models = {
    User,
    Menu,
    Products,
    MenuProducts,
};

export const initModels = (sequelize: Sequelize) => {

    setupAssociations();
};

export default models;