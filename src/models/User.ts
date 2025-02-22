import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    device_id: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: 'user' | 'admin';
    public device_id!: string | null;
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