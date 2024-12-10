import { Sequelize } from 'sequelize';

const username = process.env.DATABASE_USERNAME || "root";
const password = process.env.DATABASE_PASSWORD || "password";
const database_name = process.env.DATABASE_NAME || "project1";

const sequelize = new Sequelize(database_name, username, password, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: false,
});

export default sequelize;