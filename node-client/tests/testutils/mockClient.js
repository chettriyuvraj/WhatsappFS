const { generateRandomNumberBetweenBounds, generateRandomString } = require('./helpers');
const { EventEmitter } = require('events');
const { Events } = require('whatsapp-web.js');

class MockClient extends EventEmitter{
	constructor(chats, contacts) {
		super();
		this.chats = chats;
		this.contact = contacts;
	}

	makeReady() {
		this.emit(Events.READY);
	}

	getChats() {
		return new Promise((resolve, _) => {
			setTimeout(() => { /* TODO: add random rejects */
				resolve(chats);
			}, 3000);
		});
	}

	getContacts() {
		return new Promise((resolve, _) => {
			setTimeout(() => { /* TODO: add random rejects */
				resolve(contacts);
			}, 3000);
		});
	}
}




module.exports = {
	MockClient,
}