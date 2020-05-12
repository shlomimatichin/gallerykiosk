import * as Ajv from 'ajv';
import * as model from '../model/model';

const ajv = new Ajv({allErrors: true});
ajv.compile(Object.assign({"$id": "defs"}, require("../model/model.json")));

const validate = (definition: string, candidate: any) => {
    const valid = ajv.validate("defs#/definitions/" + definition, candidate);
    if (!valid) {
        throw new Error(`${ajv.errors}`);
    }
};

export const validateManifest = (candidate: any) => {
    validate("Manifest", candidate);
    return candidate as model.Manifest;
};

export const validateCurationSettings = (candidate: any) => {
    validate("CurationSettings", candidate);
    return candidate as model.CurationSettings;
};

export const validateRequestFileUpload = (candidate: any) => {
    validate("RequestFileUpload", candidate);
    return candidate as model.RequestFileUpload;
};
