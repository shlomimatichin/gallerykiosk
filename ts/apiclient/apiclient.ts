import { modelValidate } from './../model/modelvalidate';
import * as model from '../model/model';

export const settings = {
    apiKey: "",
    serviceEndpoint: "",
    fetchWrapper: {} as any,
};

async function get(relativePath: string) {
    const url = `${settings.serviceEndpoint}/api/v1/${relativePath}`;
    const response = await settings.fetchWrapper(url, {headers: {'X-API-Key': settings.apiKey}});
    if (!response.ok) {
        console.error(`API response for ${relativePath} is not 'ok'`, response);
        throw Error(`API call ${relativePath} Failed`);
    }
    return await response.json();
}

async function post(relativePath: string, payload: any) {
    const url = `${settings.serviceEndpoint}/api/v1/${relativePath}`;
    const response = await settings.fetchWrapper(url, {
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

export const apiClient: model.ApiClient = {
    manifestUrl: async()=>modelValidate.ResponseManifestUrl(await get('manifestUrl')).url,
    requestFileUpload: async(request: model.RequestFileUpload) => await post('requestFileUpload', request),
    getManifest: async(url: string) => {
        const response = await settings.fetchWrapper(url);
        if (!response.ok) {
            console.error(`Unable to fetch manifest ${url} is not 'ok'`, response);
            throw Error(`Fetch manifest failed`);
        }
        return modelValidate.Manifest(await response.json());
    },
};
