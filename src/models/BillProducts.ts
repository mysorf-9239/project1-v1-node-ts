import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Bill from './Bill';
import Product from './Product';

class BillProducts extends Model {
    public bill_id!: number;
    public product_id!: number;
    public quantity!: number;
}

BillProducts.init(
    {
        bill_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Bill,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
    },
    {
        sequelize,
        modelName: 'BillProducts',
        tableName: 'bill_products',
        timestamps: false,
        underscored: true,
    }
);

export default BillProducts;
