import * as aws_sdk from 'aws-sdk';
import * as dynamodb_lock_client from 'dynamodb-lock-client';
 
const lockClient = new dynamodb_lock_client.FailOpen(
    {
        dynamodb: new aws_sdk.DynamoDB.DocumentClient(),
        lockTable: process.env['DYNAMODB_LOCK_TABLE'],
        partitionKey: "ID",
        heartbeatPeriodMs: 3000,
        leaseDurationMs: 10000,
    }
);
const LOCK_NAME = "meta-lock";
 
export function withLock<T>(callback: ()=>Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject)=>{
        lockClient.acquireLock(LOCK_NAME, (error: Error, lock: any)=> {
            if (error) {
                console.error("Unable to lock", error)
                reject(error);
            }
            lock.on("error", (error: Error) => console.error("Failed to hearbeat", error));
            callback()
                .then((result: T)=>{
                    lock.release((releaseError: Error)=>{
                        if (releaseError) {
                            console.error("Unable to release lock", releaseError);
                        }
                        resolve(result);
                    });
                })
                .catch((error: Error)=>{
                    lock.release((releaseError: Error)=>{
                        if (releaseError) {
                            console.error("Unable to release lock (on callback error)", releaseError);
                        }
                        reject(error);
                    });
                });
        });
    });
}
