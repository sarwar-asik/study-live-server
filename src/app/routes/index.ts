import express from 'express';
import { authRoutes } from '../modules/AUTH/Auth.route';
import { userRoutes } from '../modules/Users/Users.route';
import { MessageRoutes } from '../modules/message/message.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    routes: userRoutes,
  },
  {
    path: '/auth',
    routes: authRoutes,
  },
  {
    path: '/message',
    routes: MessageRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
