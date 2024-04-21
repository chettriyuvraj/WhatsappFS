const { MockClient } = require('./testutils/mockClient');
const { chats, contacts, qr } = require('./testutils/testData');

describe('mock client', () => {
    test('emits ready event and returns mock data', (done) => {
        const client = new MockClient(chats, contacts, qr);
        client.on('ready', async () => {
            const [chatsGot, contactsGot] = await Promise.all([client.getChats(), await client.getContacts()]);
            expect(chatsGot).toEqual(chats);
            expect(contactsGot).toEqual(contacts);
            done();
        });
        client.emitReady();
    });

    test('emits qr code', (done) => {
        const client = new MockClient(chats, contacts, qr);
        client.on('qr', (clientQR) => {
            expect(clientQR).toEqual(qr);
            done();
        });
        client.emitQR();
    });

})