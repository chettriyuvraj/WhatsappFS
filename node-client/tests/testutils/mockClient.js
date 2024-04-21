const { generateRandomNumberBetweenBounds, generateRandomString } = require('./helpers');
const { EventEmitter } = require('events');
const { Events } = require('whatsapp-web.js');

class MockClient extends EventEmitter{
	constructor(chats, contacts, qr) {
		super();
		this.chats = chats;
		this.contacts = contacts;
		this.qr = qr;
	}

	emitReady() {
		this.emit(Events.READY);
	}

	emitQR() {
		this.emit(Events.QR_RECEIVED, this.qr);
	}

	getChats() {
		return new Promise((resolve, _) => {
			setTimeout(() => { /* TODO: add random rejects */
				resolve(this.chats);
			}, 0);
		});
	}

	getContacts() {
		return new Promise((resolve, _) => {
			setTimeout(() => { /* TODO: add random rejects */
				resolve(this.contacts);
			}, 0);
		});
	}
}




module.exports = {
	MockClient,
}