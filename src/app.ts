import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import apiRoutes from '@free-market-api/api';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', apiRoutes);

export default app;
