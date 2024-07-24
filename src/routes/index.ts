import authRouter from '../routes/auth';
import cartRouter from '../routes/cart';
import healthCheckRouter from '../routes/health';
import orderRouter from '../routes/order';
import productRouter from '../routes/product';
import userRouter from '../routes/user';

import express from 'express';

export const routes = express.Router();

routes.use('/health-check', healthCheckRouter);
routes.use('/api/auth', authRouter);
routes.use('/api/cart', cartRouter);
routes.use('/api/orders', orderRouter);
routes.use('/api/products', productRouter);
routes.use('/api/users', userRouter);
