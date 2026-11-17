// @ts-check
export const SourceType = Object.freeze({
    JAVASCRIPT: "javascript",
    TYPESCRIPT: "typescript",
    PURE_JAVASCRIPT: "pure-javascript",
    PURE_TYPESCRIPT: "pure-typescript"
});

/**
 * @typedef {typeof SourceType} _SourceType
 * @typedef {keyof _SourceType} SourceTypeKey
 * @typedef {_SourceType[SourceTypeKey]} SourceTypeValue
 * 
 * @exports SourceTypeKey
 * @exports SourceTypeValue
 */