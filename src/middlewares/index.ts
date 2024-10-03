import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const applyMiddlewares = (app: express.Application) => {
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
};

export default applyMiddlewares;
