require('dotenv').config();
import app from './app';
import syncDatabase from './config/syncDB';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    await syncDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer().then(r => console.log(`Server started!`));