import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import Postgres from './connection/postgres';
import './connection/redis';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.route';
import { authenticate } from './middleware/authenticator';
import { checkRole, Role } from './middleware/roleChecker';
import { checkOwnershipOrAdmin } from "./middleware/ownershipOrAdminChecker";


dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role?: Role;
    };
    session?: {
      id: string;
      last_active?: Date;
    };
  }
}

 async function start() {
    const app = express();

    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    await Postgres.connect();

    //routes here
    app.get("/api/test/:id", authenticate, checkOwnershipOrAdmin(), (req: express.Request, res: express.Response) => {
        res.send("API running");
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

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