/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const typescriptJSONSchema = require("typescript-json-schema");
const yargs = require("yargs");
const glob = require("glob");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const sleep = require("sleep-promise");
const Ajv = require("ajv");
const ajvPack = require("ajv-pack");

const finalArgs = Object.assign(typescriptJSONSchema.getDefaultArgs(), { required: true, ignoreErrors: true });

function needToGenerate(toGenerate, source) {
    if (!fs.existsSync(toGenerate)) {
        return true;
    }
    return fs.statSync(toGenerate).mtime <= fs.statSync(source).mtime;
}

async function generateSchema(filename) {
    const basename = path.basename(filename, ".ts");
    const schemaFilename = filename.slice(0, filename.length - ".ts".length) + "_schema.json";
    if (needToGenerate(schemaFilename, filename)) {
        fs.writeFileSync(schemaFilename, "");
        await typescriptJSONSchema.exec(filename, "*", Object.assign({}, finalArgs, { out: schemaFilename }));
        console.log("Generated", schemaFilename);
    } else {
        console.log("Up to date", schemaFilename);
    }
    for (let i = 0; i < 20; ++i) {
        const contents = fs.readFileSync(schemaFilename).toString();
        if (contents.length < 10) {
            await sleep(100);
        }
    }
    const contents = fs.readFileSync(schemaFilename).toString();
    if (contents.length < 10) {
        throw new Error("JSON schema generator did not produce valid json for: " + schemaFilename);
    }
    const schema = JSON.parse(contents);
    const definitions = schema.definitions;
    const compiledAJVFilename = filename.slice(0, filename.length - ".ts".length) + "_compiledajv.js";
    if (needToGenerate(compiledAJVFilename, filename)) {
        const ajv = new Ajv({ allErrors: true, sourceCode: true, schemaId: "auto" });
        const properties = {};
        for (const definition of Object.keys(definitions)) {
            properties[definition] = { $ref: `#/definitions/${definition}` };
        }
        const definitionSchema = Object.assign({}, schema, {
            type: "object",
            additionalProperties: false,
            properties,
        });
        const validate = ajv.compile(definitionSchema);
        let generated = ajvPack(ajv, validate).split("\n");
        generated = generated.slice(1, generated.length - 1).join("\n");
        const doValidate = `
        export function doValidate(definition, candidate) {
            const valid = validate({[definition]: candidate});
            if (!valid) {
                throw new Error(JSON.stringify(validate.errors));
            }
            return candidate;
        }\n`;
        fs.writeFileSync(compiledAJVFilename, doValidate + generated);
        console.log("Generated", compiledAJVFilename);
    } else {
        console.log("Up to date", compiledAJVFilename);
    }
    const validationsFilename = filename.slice(0, filename.length - ".ts".length) + "validate.ts";
    if (needToGenerate(validationsFilename, filename)) {
        let code = `/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { doValidate } from "./${basename}_compiledajv";
import * as ${basename} from "./${basename}";

export const ${basename}Validate = {
`;
        for (const definition of Object.keys(definitions)) {
            code += `    ${definition}: (candidate: any): ${basename}.${definition} =>
        doValidate("${definition}", candidate) as ${basename}.${definition},
`;
        }
        code += `};\n`;
        fs.writeFileSync(validationsFilename, code);
        console.log("Generated", validationsFilename);
    } else {
        console.log("Up to date", validationsFilename);
    }
}

const GLOB_PATTERN = "ts/model/*model.ts";

async function run() {
    const helpText = "Usage: schema-generator [--watch]";
    const args = yargs.usage(helpText).boolean("watch").default("watch", false).describe("watch", "Watch mode").argv;

    const filenames = glob.sync(GLOB_PATTERN);
    console.log("Schema filenames:", filenames);
    for (const filename of filenames) {
        try {
            await generateSchema(filename);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    if (args.watch) {
        console.info("Entering watch mode...");
        chokidar.watch(GLOB_PATTERN).on("change", (filename) => {
            console.log(`${filename} changed, generating`);
            generateSchema(filename);
        });
    }
}

if (typeof window === "undefined" && require.main === module) {
    run();
}

class SchemaGeneratorPlugin {
    apply(compiler) {
        compiler.hooks.beforeCompile.tapPromise("Schema Generator Plugin", async () => {
            const filenames = glob.sync(GLOB_PATTERN);
            console.log("Schema filenames:", filenames);
            for (const filename of filenames) {
                try {
                    await generateSchema(filename);
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        });
    }
}

module.exports = SchemaGeneratorPlugin;
