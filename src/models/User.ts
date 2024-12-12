import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    device_id: string | null;
    created_at: Date;
    updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: 'user' | 'admin';
    public device_id!: string | null;
    public created_at!: Date;
    public updated_at!: Date;
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {msg: 'Must be a valid email address'},
                notEmpty: {msg: 'Email cannot be empty'},
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 100],
                    msg: 'Password must be at least 6 characters long',
                },
                notEmpty: {msg: 'Password cannot be empty'},
            },
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
        },
        device_id: {
            type: DataTypes.UUID,
            allowNull: true,
            unique: true,
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
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
);

export default User;