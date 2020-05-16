export const fetchWrapper = require('node-fetch');
import * as FormData from 'form-data';
import { request } from 'https';
import { createReadStream } from 'fs';
import { parse } from 'url';

export function postFile(
    url: string,
    fields: { [key: string]: string },
    filePath: string): Promise<void> {
    const { host, port, path } = parse(url);
    const form = new FormData();
    for (const key of Object.keys(fields)) {
        form.append(key, fields[key]);
    }
    form.append('file', createReadStream(filePath));
    return new Promise<void>((resolve, reject) => {
        form.getLength((err, formLength) => {
            if (err) {
                reject(err);
                return;
            }
            const req = request(
                {
                    host,
                    port,
                    path,
                    method: 'POST',
                    headers: Object.assign({ 'content-length': formLength }, form.getHeaders()),
                },
                response => {
                    if (response.statusCode! >= 300) {
                        console.log(response.statusCode);
                        response.on('data', data => {
                            console.log(data.toString());
                        });
                        //console.log(response);
                        reject("Unable to upload file");
                    }
                    resolve();
                }
            );
            form.pipe(req);
        });

    });

}
