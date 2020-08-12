import * as express from 'express';
import * as cors from 'cors';
import {apiRouter} from './api';
import * as errorhandlers from './errorhandlers';
import * as manifeststore from './manifeststore';
import * as s3 from './s3';
import { UPLOADED_LOGS_BUCKET, MEDIA_BUCKET } from './config';


export const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api/v1', apiRouter);

app.post('/fortesting/internal/destroyalldata', async(_, res) => {
    const manifestFiles = await manifeststore.existing();
    if (manifestFiles.length > 0) {
        await manifeststore.erase(manifestFiles);
        console.warn(`Destroyed ${manifestFiles.length} manifest files!`);
    }
    while (true) {
        const mediaFiles = await s3.list(MEDIA_BUCKET);
        if (mediaFiles.length === 0) {
            break;
        }
        await s3.erase(mediaFiles, MEDIA_BUCKET);
        console.warn(`Destroyed ${mediaFiles.length} media files!`);
    }
    while (true) {
        const mediaFiles = await s3.list(UPLOADED_LOGS_BUCKET);
        if (mediaFiles.length === 0) {
            break;
        }
        await s3.erase(mediaFiles, UPLOADED_LOGS_BUCKET);
        console.warn(`Destroyed ${mediaFiles.length} media files!`);
    }
    while (true) {
        const mediaFiles = await s3.list(UPLOADED_LOGS_BUCKET);
        if (mediaFiles.length === 0) {
            break;
        }
        await s3.erase(mediaFiles, UPLOADED_LOGS_BUCKET);
        console.warn(`Destroyed ${mediaFiles.length} media files!`);
    }
    res.json({status: "ok"});
});

app.use(errorhandlers.notFound);
app.use(errorhandlers.internalServerError);
