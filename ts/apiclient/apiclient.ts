import {fetchWrapper} from './nodebrowserduality';
import * as model from '../model/model';
import { validateResponseManifestUrl, validateManifest } from '../model/schemas';
import fetch from 'node-fetch';

export const settings = {
    apiKey: "",
    serviceEndpoint: "",
};

async function get(relativePath: string) {
    const url = `${settings.serviceEndpoint}/api/v1/${relativePath}`;
    const response = await fetchWrapper(url, {headers: {'X-API-Key': settings.apiKey}});
    if (!response.ok) {
        console.error(`API response for ${relativePath} is not 'ok'`, response);
        throw Error(`API call ${relativePath} Failed`);
    }
    return await response.json();
}

async function post(relativePath: string, payload: any) {
    const url = `${settings.serviceEndpoint}/api/v1/${relativePath}`;
    const response = await fetchWrapper(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json', 'X-API-Key': settings.apiKey},
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        console.error(`API response for ${relativePath} is not 'ok'`, response);
        throw Error(`API call ${relativePath} Failed`);
    }
    return await response.json();
}

export const manifestUrl = async()=>
    validateResponseManifestUrl(await get('manifestUrl')).url;
export const requestFileUpload = async(request: model.RequestFileUpload) =>
    await post('requestFileUpload', request);
export const getManifest = async(url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Unable to fetch manifest ${url} is not 'ok'`, response);
        throw Error(`Fetch manifest failed`);
    }
    return validateManifest(await response.json());
};
