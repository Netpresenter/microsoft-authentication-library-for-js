/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class EncodingUtils {
    /**
     * 'utf8': Multibyte encoded Unicode characters. Many web pages and other document formats use UTF-8.
     * 'base64': Base64 encoding.
     *
     * @param str text
     */
    static base64Encode(str, encoding) {
        return Buffer.from(str, encoding).toString("base64");
    }
    /**
     * encode a URL
     * @param str
     */
    static base64EncodeUrl(str, encoding) {
        return EncodingUtils.base64Encode(str, encoding)
            .replace(/=/g, msalCommon.Constants.EMPTY_STRING)
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
    /**
     * 'utf8': Multibyte encoded Unicode characters. Many web pages and other document formats use UTF-8.
     * 'base64': Base64 encoding.
     *
     * @param base64Str Base64 encoded text
     */
    static base64Decode(base64Str) {
        return Buffer.from(base64Str, "base64").toString("utf8");
    }
    /**
     * @param base64Str Base64 encoded Url
     */
    static base64DecodeUrl(base64Str) {
        let str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
            str += "=";
        }
        return EncodingUtils.base64Decode(str);
    }
}

exports.EncodingUtils = EncodingUtils;
//# sourceMappingURL=EncodingUtils.cjs.map