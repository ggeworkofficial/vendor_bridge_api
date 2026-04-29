import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import Postgres from './connection/postgres';
import './connection/redis';
import authRoutes from './routes/auth.routes';


dotenv.config();

 async function start() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    await Postgres.connect();

    //routes here
    app.get("/", (req: express.Request, res: express.Response) => {
        res.send("API running");
    });

    app.use('/api/auth', authRoutes);

    app.use(errorHandler);

    const server = http.createServer(app);
    const port = process.env.PORT || 3000;

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

start().catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
});