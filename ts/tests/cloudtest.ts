import * as apiclient from '../apiclient/apiclient';
import * as fs from 'fs';
import * as path from 'path';
import * as expect from 'expect';
import fetch from 'node-fetch';
import { postFile, fetchWrapper } from '../apiclient/nodebrowserduality';
import * as sleep from 'sleep-promise';

async function destroyAllData() {
    const response = await fetch(`${apiclient.settings.serviceEndpoint}/fortesting/internal/destroyalldata`, {
        method: 'POST',
        headers: {'X-API-Key': apiclient.settings.apiKey},
    });
    if (!response.ok) {
        throw Error(`Not OK`);
    }
}

async function main() {
    const stackOutputs = JSON.parse(fs.readFileSync(path.join(process.env.TOP!, 'stackoutputs.json')).toString());
    apiclient.settings.apiKey = stackOutputs['testapikey-dev'];
    apiclient.settings.serviceEndpoint = stackOutputs.ServiceEndpoint;
    apiclient.settings.fetchWrapper = fetchWrapper;

    await destroyAllData();
    let manifestUrl = await apiclient.manifestUrl();
    let manifest = await apiclient.getManifest(manifestUrl);
    expect(manifest['mediaFiles'].length).toBe(0);
    const responseFileUpload = await apiclient.requestFileUpload({filename: 'test.png'});
    const {url, fields} = responseFileUpload['presignedPost'];
    await postFile(url, fields, path.join(process.env.TOP!, 'testdata', 'test.png'));
    await sleep(2000);
    manifestUrl = await apiclient.manifestUrl();
    manifest = await apiclient.getManifest(manifestUrl);
    expect(manifest.mediaFiles.length).toBe(1);
    expect(manifest.mediaFiles[0].key.endsWith('test.png')).toBeTruthy();
    const imageUrl = manifest.mediaFiles[0].url;
    const response = await fetch(imageUrl);
    expect(response.ok).toBeTruthy();
    console.log('DONE!');
}

main();
