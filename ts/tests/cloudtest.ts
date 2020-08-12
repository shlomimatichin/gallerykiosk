import * as apiclient from '../apiclient/apiclient';
import { apiClient } from '../apiclient/apiclient';
import * as fs from 'fs';
import * as path from 'path';
import * as expect from 'expect';
import fetch from 'node-fetch';
import { postFile, fetchWrapper } from '../apiclient/nodebrowserduality';
import * as sleep from 'sleep-promise';
import { FileKind } from '../model/model';
import * as s3 from '../backend/s3';

const stackOutputs = JSON.parse(fs.readFileSync(path.join(process.env.TOP!, 'stackoutputs.json')).toString());

async function destroyAllData() {
    const response = await fetch(`${apiclient.settings.serviceEndpoint}/fortesting/internal/destroyalldata`, {
        method: 'POST',
        headers: {'X-API-Key': apiclient.settings.apiKey},
    });
    if (!response.ok) {
        throw Error(`Not OK`);
    }
    while (true) {
        const mediaFiles = await s3.list(stackOutputs.VersionsBucket);
        if (mediaFiles.length === 0) {
            break;
        }
        await s3.erase(mediaFiles, stackOutputs.VersionsBucket);
        console.warn(`Destroyed ${mediaFiles.length} media files!`);
    }
}

async function main() {
    apiclient.settings.apiKey = stackOutputs['testapikey-dev'];
    apiclient.settings.serviceEndpoint = stackOutputs.ServiceEndpoint;
    apiclient.settings.fetchWrapper = fetchWrapper;

    await destroyAllData();
    let manifestUrl = await apiClient.manifestUrl();
    let manifest = await apiClient.getManifest(manifestUrl);
    expect(manifest['mediaFiles'].length).toBe(0);
    const responseFileUpload = await apiClient.requestFileUpload({filename: 'test.png', kind: FileKind.GALLERY_MEDIA});
    const {url, fields} = responseFileUpload['presignedPost'];
    await postFile(url, fields, path.join(process.env.TOP!, 'testdata', 'test.png'));
    await sleep(2000);
    manifestUrl = await apiClient.manifestUrl();
    manifest = await apiClient.getManifest(manifestUrl);
    expect(manifest.mediaFiles.length).toBe(1);
    expect(manifest.mediaFiles[0].key.endsWith('test.png')).toBeTruthy();
    const imageUrl = manifest.mediaFiles[0].url;
    const response = await fetch(imageUrl);
    expect(response.ok).toBeTruthy();
    console.log('DONE!');
}

main();
