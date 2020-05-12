import * as express from 'express';
import {apiRouter} from './api';
import * as errorhandlers from './errorhandlers';

export const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(errorhandlers.notFound);
app.use(errorhandlers.internalServerError);
