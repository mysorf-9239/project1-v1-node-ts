import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface MenuAttributes {
    id: number;
    name: string;
    description: string;
}

interface MenuCreationAttributes extends Optional<MenuAttributes, 'id'> {
}

class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
}

Menu.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: 'Name cannot be empty'},
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Menu',
        tableName: 'menus',
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
);

export default Menu;