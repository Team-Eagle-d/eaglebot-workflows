// @ts-check

import { SourceType } from "../constants/source-type.constant.js";

/**
 * @param {string | undefined} sourceType
 * @returns {sourceType is (typeof SourceType)[keyof typeof SourceType]}
 */
export function validateSourceType(sourceType) {
    if(!sourceType) {
        console.error(`::error::Can't find source type enviornment variable.`);
        process.exit(1);
    }

    switch(sourceType) {
        case SourceType.JAVASCRIPT:
        case SourceType.TYPESCRIPT:
        case SourceType.PURE_JAVASCRIPT:
        case SourceType.PURE_TYPESCRIPT:
            return true;

        default:
            return false;
    }
}