import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database';

class MenuProducts extends Model {
}

MenuProducts.init(
    {
        menu_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menus',
                key: 'id',
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'MenuProducts',
        tableName: 'menu_products',
        timestamps: false,
        underscored: true,
        paranoid: true,
    }
);

export default MenuProducts;