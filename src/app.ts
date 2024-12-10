import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';


const app: Application = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

export default app;
