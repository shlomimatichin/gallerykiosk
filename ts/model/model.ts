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

export interface RequestFileUpload {
    filename: string;
}
