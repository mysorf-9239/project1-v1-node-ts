import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface MenuAttributes {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

interface MenuCreationAttributes extends Optional<MenuAttributes, 'id' | 'created_at' | 'updated_at'> {
}

class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public created_at!: Date;
    public updated_at!: Date;
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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