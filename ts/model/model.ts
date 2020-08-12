export interface ApiClient {
    manifestUrl: () => Promise<string>;
    requestFileUpload: (request: RequestFileUpload)=>Promise<any>;
    getManifest: (url: string)=>Promise<Manifest>;
};

export interface CurationSettings {
    maxFiles: number;
    maxDays: number;
};

export interface MediaFile {
    url: string;
    key: string;
    dateAdded: string;
};

export interface Manifest {
    curationSettings: CurationSettings;
    mediaFiles: MediaFile[];
};

export enum FileKind {
    GALLERY_MEDIA = "GALLERY_MEDIA",
    LOG = "LOG",
    SPY_MEDIA = "SPY_MEDIA",
}

export interface RequestFileUpload {
    filename: string;
    kind: FileKind;
}

export interface ResponseManifestUrl {
    url: string;
}
