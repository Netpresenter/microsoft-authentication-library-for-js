/*! @azure/msal-node v2.9.1 2024-06-04 */
'use strict';
'use strict';

var GuidGenerator = require('./GuidGenerator.cjs');
var EncodingUtils = require('../utils/EncodingUtils.cjs');
var PkceGenerator = require('./PkceGenerator.cjs');
var HashUtils = require('./HashUtils.cjs');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * This class implements MSAL node's crypto interface, which allows it to perform base64 encoding and decoding, generating cryptographically random GUIDs and
 * implementing Proof Key for Code Exchange specs for the OAuth Authorization Code Flow using PKCE (rfc here: https://tools.ietf.org/html/rfc7636).
 * @public
 */
class CryptoProvider {
    constructor() {
        // Browser crypto needs to be validated first before any other classes can be set.
        this.pkceGenerator = new PkceGenerator.PkceGenerator();
        this.guidGenerator = new GuidGenerator.GuidGenerator();
        this.hashUtils = new HashUtils.HashUtils();
    }
    /**
     * Creates a new random GUID - used to populate state and nonce.
     * @returns string (GUID)
     */
    createNewGuid() {
        return this.guidGenerator.generateGuid();
    }
    /**
     * Encodes input string to base64.
     * @param input - string to be encoded
     */
    base64Encode(input) {
        return EncodingUtils.EncodingUtils.base64Encode(input);
    }
    /**
     * Decodes input string from base64.
     * @param input - string to be decoded
     */
    base64Decode(input) {
        return EncodingUtils.EncodingUtils.base64Decode(input);
    }
    /**
     * Generates PKCE codes used in Authorization Code Flow.
     */
    generatePkceCodes() {
        return this.pkceGenerator.generatePkceCodes();
    }
    /**
     * Generates a keypair, stores it and returns a thumbprint - not yet implemented for node
     */
    getPublicKeyThumbprint() {
        throw new Error("Method not implemented.");
    }
    /**
     * Removes cryptographic keypair from key store matching the keyId passed in
     * @param kid
     */
    removeTokenBindingKey() {
        throw new Error("Method not implemented.");
    }
    /**
     * Removes all cryptographic keys from Keystore
     */
    clearKeystore() {
        throw new Error("Method not implemented.");
    }
    /**
     * Signs the given object as a jwt payload with private key retrieved by given kid - currently not implemented for node
     */
    signJwt() {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns the SHA-256 hash of an input string
     */
    async hashString(plainText) {
        return EncodingUtils.EncodingUtils.base64EncodeUrl(this.hashUtils.sha256(plainText).toString("base64"), "base64");
    }
}

exports.CryptoProvider = CryptoProvider;
//# sourceMappingURL=CryptoProvider.cjs.map