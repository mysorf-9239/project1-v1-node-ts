import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BillAttributes {
    id: number;
    user_id: number;
    device_id: string | null;
    amount: number;
}

interface BillCreationAttributes extends Optional<BillAttributes, 'id'> {}

class Bill extends Model<BillAttributes, BillCreationAttributes> implements BillAttributes {
    public id!: number;
    public user_id!: number;
    public device_id!: string | null;
    public amount!: number;
}

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
                model: 'users',
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
