import { modelValidate } from './../model/modelvalidate';
import * as express from "express";
import * as manifeststore from "./manifeststore";
import * as s3 from "./s3";
import * as cloudlock from "./cloudlock";
import * as model from "../model/model";
import { MANIFEST_VALID_FOR_SECONDS } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { UPLOADED_LOGS_BUCKET, META_BUCKET, MEDIA_BUCKET } from "./config";

export const apiRouter = express.Router();

apiRouter.get("/manifestUrl", async (_, res) => {
    const key = await cloudlock.withLock(async () => {
        let key = await manifeststore.getLatestManifest();
        if (key === null) {
            const manifest = manifeststore.defaultEmptyManifest();
            key = await manifeststore.replace(manifest);
            console.log("Initial manifest generated", key);
        } else {
            if (manifeststore.expiredManifestKey(key)) {
                const manifest = await manifeststore.download(key);
                key = await manifeststore.replace(manifest);
                console.log("Manifest expired, replaced", key);
            }
        }
        return key;
    });
    const result: model.ResponseManifestUrl = {
        url: s3.presignedGet(key, META_BUCKET, MANIFEST_VALID_FOR_SECONDS),
    };
    res.json(result);
});

apiRouter.post("/requestFileUpload", async (req, res) => {
    const requestFileUpload = modelValidate.RequestFileUpload(req.body);
    const now = new Date();
    const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
    const day = `${now.getUTCDate()}`.padStart(2, "0");
    const today = `${now.getUTCFullYear()}${month}${day}`;
    const uuid = uuidv4();
    const key = `${today}/${uuid}/${requestFileUpload.filename}`;
    const presignedPost = await s3.serializedPresignedPost(
        key,
        requestFileUpload.kind === model.FileKind.GALLERY_MEDIA ? MEDIA_BUCKET : UPLOADED_LOGS_BUCKET
    );
    res.json({ presignedPost });
});

apiRouter.post("/changeCurationSettings", async (req, res) => {
    const curationSettings = modelValidate.CurationSettings(req.body);
    await cloudlock.withLock(async () => {
        const lastKey = await manifeststore.getLatestManifest();
        const manifest: model.Manifest =
            lastKey === null ? manifeststore.defaultEmptyManifest() : await manifeststore.download(lastKey);
        manifest.curationSettings = curationSettings;
        await manifeststore.replace(manifest);
    });
    console.log("Changed curation settings", curationSettings);
    res.json({ status: "ok" });
});
