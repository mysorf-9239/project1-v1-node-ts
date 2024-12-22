import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Product from './Product';
import BillProducts from './BillProducts';

interface BillAttributes {
    id: number;
    user_id: number;
    device_id: string | null;
    amount: number;
    created_at: Date;
    updated_at: Date;
}

interface BillCreationAttributes extends Optional<BillAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Bill extends Model<BillAttributes, BillCreationAttributes> implements BillAttributes {
    public id!: number;
    public user_id!: number;
    public device_id!: string | null;
    public amount!: number;
    public created_at!: Date;
    public updated_at!: Date;

    public async calculateAmount(): Promise<number> {
        const billProducts = await BillProducts.findAll({ where: { bill_id: this.id }, include: [Product] });

        return billProducts.reduce((total, bp: any) => {
            const productPrice = bp.Product?.price || 0;
            return total + productPrice * bp.quantity;
        }, 0);
    }
}

Bill.beforeCreate(async (bill) => {
    bill.amount = await bill.calculateAmount();
});

Bill.beforeUpdate(async (bill) => {
    bill.amount = await bill.calculateAmount();
});

Bill.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        device_id: {
            type: DataTypes.UUID,
            allowNull: true,
            validate: {
                isUUID: 4,
            },
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isFloat: true,
                min: 0,
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
        modelName: 'Bill',
        tableName: 'bills',
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
);

export default Bill;
