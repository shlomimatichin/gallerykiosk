type CallbackFunction<R> = (error: Error, result:R) => void;

export default async function promisify<R>(foo:(callback: CallbackFunction<R>)=>void) : Promise<R> {
    const promise = new Promise<R>((resolve, reject) => {
        foo((error:Error, result:R) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
    return await promise;
}
