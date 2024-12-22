import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

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
                model: 'bills',
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
