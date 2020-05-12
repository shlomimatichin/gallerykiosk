import * as express from 'express';

export const notFound = (_: express.Request, res: express.Response, __: express.NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Requested Resource Not Found (404)'
    }).end();
};

export const internalServerError = (err: any, _: express.Request, res: express.Response, __: express.NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err
    }).end();
};
