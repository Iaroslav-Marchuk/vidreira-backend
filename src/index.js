import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import router from './routers/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

const allowedOrigin = 'http://localhost:5173/'; //---------------змінити адресу після деплою
const app = express();

app.use(express.json());
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(cookieParser());

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
