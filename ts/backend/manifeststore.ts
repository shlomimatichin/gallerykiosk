import * as s3 from './s3';
import * as model from '../model/model';
import { MANIFEST_VALID_FOR_SECONDS } from './constants';
import { META_BUCKET, MEDIA_BUCKET } from './config';
import { modelValidate } from '../model/modelvalidate';

const MANIFEST_KEY_PREFIX = "manifest_";

export const defaultEmptyManifest = (): model.Manifest => ({
    curationSettings: {
        maxDays: 90,
        maxFiles: 1000,
    },
    mediaFiles: [],
});

export const generateManifestKey = ()=> MANIFEST_KEY_PREFIX + new Date().toISOString();
export const parseManifestKey = (key: string): Date =>
    new Date(Date.parse(key.substr(MANIFEST_KEY_PREFIX.length)));

export const expiredManifestKey = (key: string): boolean =>
    (new Date()).getTime() - parseManifestKey(key).getTime() > (MANIFEST_VALID_FOR_SECONDS - 60 * 60) * 1000;

export const existing = (): Promise<string[]> => s3.list(META_BUCKET, MANIFEST_KEY_PREFIX);

export const getLatestManifest = async(): Promise<string | null> => {
    const currentlyExisting = await existing();
    if (currentlyExisting.length === 0) {
        return null;
    }
    currentlyExisting.sort();
    return currentlyExisting[currentlyExisting.length - 1];
};

export const download = async(key: string): Promise<model.Manifest> => {
    const contents = await s3.get(key, META_BUCKET);
    const raw = JSON.parse(contents.toString());
    return modelValidate.Manifest(raw);
};

export const upload = async(key: string, manifest: model.Manifest): Promise<void> => {
    const contents = JSON.stringify(manifest);
    await s3.put(key, META_BUCKET, contents);
};

export const erase = (keys: string[]): Promise<void> => s3.erase(keys, META_BUCKET);

export const replace = async(manifest: model.Manifest): Promise<string> => {
    for (const mediaFile of manifest.mediaFiles) {
        mediaFile.url = s3.presignedGet(mediaFile.key, MEDIA_BUCKET, MANIFEST_VALID_FOR_SECONDS);
    }
    const previous = await existing();
    const newKey = generateManifestKey();
    await upload(newKey, manifest);
    if (previous.length) {
        await erase(previous);
    }
    return newKey;
};
