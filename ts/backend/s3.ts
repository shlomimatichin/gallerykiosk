import * as AWS from 'aws-sdk';
import promisify from './promisify';

const s3 = new AWS.S3();

export function presignedGet(key: string, bucket: string, expires: number = 3600): string {
    return s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: expires,
    });
}

export function serializedPresignedPost(key: string, bucket: string, expires: number = 3600): Promise<any> {
    return new Promise((resolve, reject)=>{
        s3.createPresignedPost({
            Bucket: bucket,
            Fields: {key: key, acl: 'private'},
            Conditions: [ {acl: 'private'}, {key: key} ],
            Expires: expires,
        }, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

export async function head(key: string, bucket: string): Promise<any> {
    return await promisify((callback)=>s3.headObject({
        Bucket: bucket,
        Key: key,
    }, callback))
    .catch((e: Error)=>{console.error("Unable to head s3 key", key, bucket); throw e;});
}

export async function erase(keys: string[], bucket: string): Promise<void> {
    await promisify((callback)=>s3.deleteObjects({
        Bucket: bucket,
        Delete: {Objects: keys.map(k=>({Key: k}))},
    }, callback));
}

export async function list(bucket: string, prefix?: string): Promise<string[]> {
    return await promisify((callback)=>s3.listObjects({
        Bucket: bucket,
        Prefix: prefix ?? "",
    }, callback))
    .then((data:any)=>data['Contents'].map((k:any)=>k.Key));
}

export async function put(key: string, bucket: string, body: string | Buffer): Promise<void> {
    return await promisify((callback)=>s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: body,
    }, callback))
    .then(()=>{console.info(`Successfully uploaded ${key} to bucket ${bucket}`);})
    .catch((e)=>{console.error(`Unable to upload ${key} to bucket ${bucket}`, e); throw e;});
}

export async function get(key: string, bucket: string): Promise<Buffer>{
    return await promisify((callback)=>s3.getObject({
        Bucket: bucket,
        Key: key,
    }, callback))
    .then((data:any)=>{
        console.info(`Successfully downloaded ${key} from ${bucket}`);
        return data.Body;})
    .catch((e)=>{console.error(`Unable to download ${key} from ${bucket}`, e); throw e;});
}
