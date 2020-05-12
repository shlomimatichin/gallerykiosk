import * as express from 'express';
import * as manifeststore from './manifeststore';
import * as s3 from './s3';
import * as cloudlock from './cloudlock';
import * as schemas from './schemas';
import * as model from '../model/model';
import * as process from 'process';
import { MANIFEST_VALID_FOR_SECONDS } from './constants';

export const MEDIA_BUCKET = process.env.MEDIA_BUCKET!;
export const apiRouter = express.Router();

apiRouter.get('/manifestUrl', async(_, res) => {
    const key = await cloudlock.withLock(async()=>{
        let key = await manifeststore.getLatestManifest();
        if (key === null) {
            const manifest = manifeststore.defaultEmptyManifest();
            key = await manifeststore.replace(manifest);
            console.log("Initial manifest generated", key);
        } else {
            if (manifeststore.expiredManifestKey(key)) {
                const manifest = await manifeststore.download(key);
                key = await manifeststore.replace(manifest);
                console.log("Manifest expired, replaced", key);
            }
        }
        return key;
    });
    res.json({
        url: s3.presignedGet(key, manifeststore.META_BUCKET, MANIFEST_VALID_FOR_SECONDS),
    });
});

apiRouter.post('/requestFileUpload', async(req, res) => {
    const requestFileUpload = schemas.validateRequestFileUpload(req.body);
    const now = new Date();
    const key = `${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}/RANDOMSHIT/${requestFileUpload.filename}`;
    const presignedPost = await s3.serializedPresignedPost(key, MEDIA_BUCKET);
    res.json({presignedPost});
});

apiRouter.post('/changeCurationSettings', async(req, res) => {
    const curationSettings = schemas.validateCurationSettings(req.body);
    await cloudlock.withLock(async()=>{
        const lastKey = await manifeststore.getLatestManifest();
        const manifest: model.Manifest = (lastKey === null) ?
            manifeststore.defaultEmptyManifest() :
            await manifeststore.download(lastKey);
        manifest.curationSettings = curationSettings;
        await manifeststore.replace(manifest);
    });
    console.log("Changed curation settings", curationSettings);
    res.json({"status": "ok"});
});
