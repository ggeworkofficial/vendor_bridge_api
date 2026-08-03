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
import categoryRoutes from './routes/category.routes';
import sellerRoutes from './routes/seller.routes';
import inventoryRoutes from './routes/inventory.routes';
import productImageRoutes from './routes/product-image.routes';
import reviewRoutes from './routes/review.routes';
import orderRoutes from './routes/order.routes';
import receiptRoutes from './routes/receipt.routes';
import complaintRoutes from './routes/complaint.routes';
import logisticsRoutes from './routes/logistics.routes';
import paymentAccountRoutes from './routes/payment-account.routes';
import settingsRoutes from './routes/settings.routes';
import { authenticate } from './middleware/authenticator';
import { checkRole, Role } from './middleware/roleChecker';
import { checkOwnershipOrAdmin } from "./middleware/ownershipOrAdminChecker";
import path from 'path';


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
        origin: ["http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:8080"],
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
    app.use('/api/categories', categoryRoutes);
    app.use('/api/sellers', sellerRoutes);
    app.use('/api/inventory', inventoryRoutes);
    app.use('/api/product-images', productImageRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/receipts', receiptRoutes);
    app.use('/api/complaints', complaintRoutes);
    app.use('/api/logistics', logisticsRoutes);
    app.use('/api/payment-accounts', paymentAccountRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/uploads', express.static(path.join(__dirname, "../uploads")));

    app.use((req, res) => {
      res.status(404).send('Page not found');
    })

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