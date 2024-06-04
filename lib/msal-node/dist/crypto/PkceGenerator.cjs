/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var msalCommon = require('@azure/msal-common');
var Constants = require('../utils/Constants.cjs');
var EncodingUtils = require('../utils/EncodingUtils.cjs');
var HashUtils = require('./HashUtils.cjs');
var crypto = require('crypto');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * https://tools.ietf.org/html/rfc7636#page-8
 */
class PkceGenerator {
    constructor() {
        this.hashUtils = new HashUtils.HashUtils();
    }
    /**
     * generates the codeVerfier and the challenge from the codeVerfier
     * reference: https://tools.ietf.org/html/rfc7636#section-4.1 and https://tools.ietf.org/html/rfc7636#section-4.2
     */
    async generatePkceCodes() {
        const verifier = this.generateCodeVerifier();
        const challenge = this.generateCodeChallengeFromVerifier(verifier);
        return { verifier, challenge };
    }
    /**
     * generates the codeVerfier; reference: https://tools.ietf.org/html/rfc7636#section-4.1
     */
    generateCodeVerifier() {
        const charArr = [];
        const maxNumber = 256 - (256 % Constants.CharSet.CV_CHARSET.length);
        while (charArr.length <= Constants.RANDOM_OCTET_SIZE) {
            const byte = crypto.randomBytes(1)[0];
            if (byte >= maxNumber) {
                /*
                 * Ignore this number to maintain randomness.
                 * Including it would result in an unequal distribution of characters after doing the modulo
                 */
                continue;
            }
            const index = byte % Constants.CharSet.CV_CHARSET.length;
            charArr.push(Constants.CharSet.CV_CHARSET[index]);
        }
        const verifier = charArr.join(msalCommon.Constants.EMPTY_STRING);
        return EncodingUtils.EncodingUtils.base64EncodeUrl(verifier);
    }
    /**
     * generate the challenge from the codeVerfier; reference: https://tools.ietf.org/html/rfc7636#section-4.2
     * @param codeVerifier
     */
    generateCodeChallengeFromVerifier(codeVerifier) {
        return EncodingUtils.EncodingUtils.base64EncodeUrl(this.hashUtils.sha256(codeVerifier).toString("base64"), "base64");
    }
}

exports.PkceGenerator = PkceGenerator;
//# sourceMappingURL=PkceGenerator.cjs.map