import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
    id: number;
    name: string;
    description: string;
    price: number;
    created_at: Date;
    updated_at: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'created_at' | 'updated_at'> {
}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public created_at!: Date;
    public updated_at!: Date;
}

Product.init(
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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
                min: 0,
                notEmpty: {msg: 'Price cannot be empty'},
            },
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
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
);

export default Product;