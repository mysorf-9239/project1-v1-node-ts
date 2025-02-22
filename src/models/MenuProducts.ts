import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database';

class MenuProducts extends Model {
    public menu_id!: number;
    public product_id!: number;
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
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
            onDelete: 'CASCADE',
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