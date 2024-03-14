const { parseMessage, MessageFormat, MESSAGEFIELDTYPES} = require( "./client.js");
const {describe, it} = require( "node:test");
const assert = require('node:assert/strict');

/** 
 * Generate random messages, convert to byte stream and check if correctly parsed
 **/ 
describe("Parse messages sent by filesystem", () => {
    for (i = 0; i<100; i++) {
        let messageAsBytes = Buffer.from("", "utf-8");
        const message = {};
        for (const field in MessageFormat) {
            const {type, length} = MessageFormat[field];
            let buffer;
            switch (type) {
                case MESSAGEFIELDTYPES.STRING:
                    /* Generate random string, fill remaining space with '\x00' - this is how struct sent by filesystem is structured */
                    const randomStringLength = generateRandomInt(0, length + 1)
                    let randomString = generateRandomString(randomStringLength);
                    /* Note down the string before filling it up with null chars */
                    message[field] = randomString;
                    randomString = randomString.concat('\x00'.repeat(length - randomStringLength))
                    buffer = Buffer.from(randomString, "utf-8")
            }
            messageAsBytes = Buffer.concat([messageAsBytes, buffer]);
        }
        parsedMessage = parseMessage(messageAsBytes);
        assert.deepEqual(message, parsedMessage);
    }
});

/*** Helper functions ***/

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = generateRandomInt(0, chars.length);
        randomString += chars[randomIndex];
    }
    return randomString;
}

/** 
 * Note: leftBound inclusive, rightBound exclusive
 * Undefined behaviour if leftBound > rightBound
 **/ 
function generateRandomInt(leftBound, rightBound) {
    return Math.floor(Math.random() * (rightBound - leftBound)) + leftBound;
}