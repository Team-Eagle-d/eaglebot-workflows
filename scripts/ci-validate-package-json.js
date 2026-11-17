// @ts-check

/**
 * @import { IPackageJson } from "package-json-type"
 * @import { JavaScriptType } from "../types/javascript.type.ts"
 */

import "dotenv/config";
import { glob, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { validatePackageJson  } from "../utils/validate-package-json.util.js";
import { validateSourceType } from "../utils/validate-source-type.util.js";
import semver from "semver";

const SOURCE_TYPE = process.env["SOURCE_TYPE"];
if(!validateSourceType(SOURCE_TYPE)) {
    console.error(`::error::${SOURCE_TYPE} is not valid source type.`);
    process.exit(1);
}

const PACKAGE_PATH = process.env["PACKAGE_JSON_PATH"];
if(!PACKAGE_PATH) {
    console.error("::error::package.json path is required.");
    process.exit(1);
}

const packageJson = JSON.parse(
    await readFile(
        join(process.cwd(), PACKAGE_PATH),
        "utf8"
    )
);

if(!validatePackageJson(packageJson)) {
    console.error("::error::package.json does not have valid structure.");
    process.exit(1);
}

/**
 * @param {any} value 
 * @returns {boolean}
 */
function checkVersion(value) {
    return semver.valid(value) !== null;
}

/**
 * @typedef {{
 *      readonly fileName:string,
 *      readonly altFileNames?:string[],
 *      readonly severity:"error" | "warn"
 * }} _FileProperty
 */

/**
 * @type {_FileProperty[]}
 */
const fileProperties = [
    SOURCE_TYPE.startsWith("pure-") ? {
        fileName: "src",
        severity: "error"
    } : {
        fileName: "dist",
        severity: "error"
    },
    {
        fileName: "README",
        altFileNames: [
            "README.md"
        ],
        severity: "warn"
    },
    {
        fileName: "CHANGELOG",
        altFileNames: [
            "CHANGELOG.md"
        ],
        severity: "warn"
    },
    {
        fileName: "tsconfig.json",
        severity: "warn"
    }
];

/**
 * 
 * @param {string} file 
 * @param {_FileProperty} fileProperty
 * @returns {boolean}
 */
function matchesFile(file, fileProperty) {
    const last = basename(file);

    if(last === fileProperty.fileName) {
        return true;
    }

    return fileProperty.altFileNames?.some((altFileName) => {
        return last === altFileName;
    }) ?? false;
}

/**
 * @param {any} value 
 * @returns {Promise<boolean>}
 */
async function checkFiles(value) {
    if(!Array.isArray(value)) {
        return false;
    }

    if(value.length <= 0) {
        return false;
    }

    if(!value.every((v) => {
        return typeof v === "string";
    })) {
        return false
    }

    for(const item of value) {
        let found = false;
        for await(const file of glob(item)) {
            found = true;

            break;
        }

        if(!found) {
            return false;
        }
    }

    for(const fileProperty of fileProperties) {
        const found = value.some((file) => {
            return matchesFile(file, fileProperty);
        });
        
        if(!found) {
            switch(fileProperty.severity) {
                case "error":
                    console.error(`::error::${fileProperty.fileName} does not exists.`);

                    return false;

                case "warn":
                    console.warn(`::warning::Can't find ${fileProperty.fileName} file. Are you missing it?`);
            }
        }
    }

    return true;
}

/**
 * @type {(keyof IPackageJson)[]}
 */
const requiredPackageFields = [
    "name",
    "version",
    "files"
];

/**
 * @type {Partial<Record<keyof IPackageJson, {
 *      type:JavaScriptType[],
 *      checkFunc?:(value:any) => boolean | Promise<boolean>
 * }>>}
 */
const packageFieldTypes = {
    "name": {
        type: [
            "string"
        ]
    },
    "version": {
        type: [
            "string"
        ],
        checkFunc: checkVersion
    },
    "files": {
        type: [
            "object"
        ],
        checkFunc: checkFiles
    }
}

for(const requiredField of requiredPackageFields) {
    if(packageJson[requiredField] == undefined) {
        console.error(`::error::${requiredField} does not exists.`);
        process.exit(1);
    }

    const fieldType = packageFieldTypes[requiredField];
    if(!fieldType) {
        console.error("::error::wh");
        process.exit(1);
    }

    const type = fieldType.type;
    if(!type.includes(typeof packageJson[requiredField])) {
        console.error(`::error::typeof ${requiredField} should be included in "${type}"`);
        process.exit(1);
    }

    if(!fieldType.checkFunc) {
        continue;
    }

    const result = await fieldType.checkFunc(packageJson[requiredField]);
    if(!result) {
        process.exit(1);
    }
}
