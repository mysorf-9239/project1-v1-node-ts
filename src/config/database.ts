import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.MYSQL_URL;

const sequelize = DATABASE_URL
    ? new Sequelize(DATABASE_URL, {
        dialect: 'mysql',
        logging: false,
    })
    : new Sequelize(
        process.env.MYSQLDATABASE || "project1",
        process.env.MYSQL_USER || "root",
        process.env.MYSQL_PASSWORD || "password",
        {
            host: process.env.MYSQLHOST || "localhost",
            dialect: 'mysql',
            port: +(process.env.MYSQLPORT ?? 3306),
            logging: false,
        }
    );

export default sequelize;
