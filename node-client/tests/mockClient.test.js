const { Routes } = require('../client');
const { MockClient } = require('./testutils/mockClient');
const { chats, contacts } = require('./testutils/testData');
// const { describe, test, expect } = require('jest');

describe('mock client', () => {
    test('client emits ready event', done => {
        const client = new MockClient(chats, contacts);
        client.once('ready', () => {
            expect(1).toBe(1);
            done();
        });
        client.makeReady();
    });
})