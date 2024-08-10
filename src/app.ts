import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import path from 'path';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import config from './config';

const app: Application = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://study-live-frontend.onrender.com',
    ],
    // config.env === 'development'
    //   ? [
    //       '*',
    //       // 'http://localhost:3000',
    //       // 'http://127.0.0.1:3000',
    //       // 'http://192.168.0.101:3000',
    //       // 'http://localhost:5173',
    //       // 'http://localhost:5174',
    //     ]
    //   : ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: httpStatus.OK,
    message: `sarwar-server is running on http://localhost:${config.port}`,
  });
});

// API routes
app.use('/api/v1', router);

// Global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

export default app;
