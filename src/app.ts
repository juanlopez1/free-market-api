import express from 'express';

import applyMiddlewares from '@free-market-api/middlewares';
import routes from '@free-market-api/routes';

const app = express();

applyMiddlewares(app);

app.use('/', routes);

export default app;
