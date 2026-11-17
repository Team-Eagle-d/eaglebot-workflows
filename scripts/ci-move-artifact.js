// @ts-check
import "dotenv/config";
import { validatePackageJson } from "../utils/validate-package-json.util.js";
import { cp, readFile, rm } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { mkdir, glob } from "node:fs/promises";

const ROOT = process.cwd();

const PACKAGE_PATH = process.env["PACKAGE_JSON_PATH"];
if(!PACKAGE_PATH) {
    console.error("::error::package.json path is required.");
    process.exit(1);
}

const ARTIFACT_PATH = process.env["ARTIFACT_PATH"];
if(!ARTIFACT_PATH) {
    console.error("::error::artifact directory path is required.");
    process.exit(1);
}

const packageJson = JSON.parse(
    await readFile(
        join(ROOT, PACKAGE_PATH),
        "utf8"
    )
);

if(!validatePackageJson(packageJson)) {
    console.error("::error::package.json does not have valid structure.");
    process.exit(1);
}

const files = packageJson.files;

if(!files) {
    console.error("::error::package.json does not have own files field.");
    process.exit(1);
}

const artifactFullPath = join(ROOT, ARTIFACT_PATH);

try {
    await rm(artifactFullPath, {
        recursive: true,
        force: true
    })
}
catch(e) {}

await mkdir(artifactFullPath);

for(const file of files) {
    for await(const foundFile of glob(file, {
        cwd: ROOT,
        withFileTypes: true,
        exclude: [
            artifactFullPath,
            `${artifactFullPath}/**`
        ]
    })) {
        const originalPath = resolve(ROOT, foundFile.parentPath, foundFile.name);
        const relativePath = relative(ROOT, originalPath);
        const destinationPath = join(artifactFullPath, relativePath);

        await mkdir(dirname(destinationPath), {
            recursive: true
        });

        await cp(originalPath, destinationPath, {
            recursive: true
        });
    }
}