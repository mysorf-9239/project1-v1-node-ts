import sequelize from './database';
import {initModels} from '../models';

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        initModels(sequelize);

        const isDevelopment = process.env.NODE_ENV === 'development' || false;
        await sequelize.sync({force: isDevelopment});     // force: true -> dev, alter: true -> prd
        console.log(`Models synchronized${isDevelopment ? ' with force' : ''}!`);
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

export default syncDatabase;