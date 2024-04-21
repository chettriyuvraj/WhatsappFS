const { connectWhatsapp, Routes } = require('../client');
const { MockClient } = require('./testutils/mockClient');
const { chats, contacts } = require('./testutils/testData');

describe('routes behave correctly', () => {
    test('reads chats directly correctly', async() => {
        const client = new MockClient(chats, contacts);
        const path = '/chats';
        const action = 'readdir';
        const chatNamesGot = await Routes[path][action](client);
        const chatNamesWant = ['.', '..', ...chats.map(chat => chat.name)]
        expect(chatNamesGot).toEqual(chatNamesWant);
    });
})