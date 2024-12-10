import sequelize from './database';
import User from '../models/User';

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        await sequelize.sync({ force: false }); // Sử dụng { force: true } chỉ khi muốn reset bảng.
        console.log('Models synchronized!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

export default syncDatabase;
