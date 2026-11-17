// @ts-check

/**
 * @import { IPackageJson } from "package-json-type"
 */

/**
 * @param {any} packageJson
 * @returns {packageJson is IPackageJson}
 */
export function validatePackageJson(packageJson) {
    return typeof packageJson !== null
        && typeof packageJson === "object"
        && !Array.isArray(packageJson);
}