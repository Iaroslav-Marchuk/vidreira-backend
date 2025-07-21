import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import router from './routers/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use(express.json());
app.use(cors());

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
