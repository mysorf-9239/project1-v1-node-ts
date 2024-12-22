import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';

const app: Application = express();

app.use(cors());

// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//         credentials: true
//     })
// );

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

export default app;
