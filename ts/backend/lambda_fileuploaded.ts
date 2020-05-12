import * as aws_lambda from 'aws-lambda';
import * as cloudlock from './cloudlock';
import * as manifeststore from './manifeststore';
import * as model from '../model/model';

export async function handler(event:aws_lambda.S3Event) {
    const keys = event.Records.map(e=>e.s3.object.key);
    await cloudlock.withLock(async()=>{
        const lastKey = await manifeststore.getLatestManifest();
        const manifest: model.Manifest = (lastKey === null) ?
            manifeststore.defaultEmptyManifest() :
            await manifeststore.download(lastKey);
        const now = new Date().toISOString();
        manifest.mediaFiles.push(...keys.map(key=>({url: "NA", key, dateAdded: now})));
        while (manifest.curationSettings.maxFiles < manifest.mediaFiles.length) {
            manifest.mediaFiles.shift();
        }
//TODO: curate by date as well
        await manifeststore.replace(manifest);
    });
    console.log("Successfully added new media to manifest", keys);
}
