import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import config from './config';
import { swaggerApiSpecification, swaggerUiOptions } from './utils/swagger.spec';

const app: Application = express();

app.use(
  cors({
    origin: 
    config.env === 'development'
      ? [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://192.168.0.101:3000',
          'http://localhost:5173',
          'http://localhost:5174',
        ]
      : ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerApiSpecification, swaggerUiOptions));
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerApiSpecification);
});

// Root route
app.get('/', async (req: Request, res: Response) => {
  const resData :any= {
    success: true,
    message: `Running the ${config.server_name} server`,
    statusCode: 201,
    data: null,
    serverUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  }
  if(config.env === 'development'){
    resData.logs = `${req.protocol}://${req.get('host')}${req.originalUrl}logs/errors`;
  }
  res.json(resData);
  // next();
});

// API routes
app.use('/api/v1', router);

// Global error handler


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

app.use(globalErrorHandler);

export default app;
