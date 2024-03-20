const MessageQueue = require('svmq');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

/*** Info regarding the message sent from filesystem - each message represents an action e.g. readdir ***/
const FILESYSMESSAGETYPE = 1
const MESSAGEQUEUEKEY = 310898
const MESSAGEFIELDTYPES = {
    STRING: 'string'
};
const MessageFormat = {
    action: {
        type: MESSAGEFIELDTYPES.STRING,
        length: 30
    },
    path: {
        type: MESSAGEFIELDTYPES.STRING,
        length: 100
    }
};
const Routes = {};

/*** Core functions ***/


const connectWhatsapp = () => {
    const client = new Client();

    client.once('ready', () => {
        console.log('Client is ready!');
    });

    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, {small: true});
    });

    // Start your client
    client.initialize();
}

/**
 * Pop message off the queue and parse them
 **/
const connect = () => {
    const queue = MessageQueue.open(MESSAGEQUEUEKEY);
    queue.pop({ type: FILESYSMESSAGETYPE }, (err, data) => {
    const message = parseMessage(data);
    console.log(message);
    });
}


Routes["/"] = {
    readdir: async () => {
        
    }
};


/*** Helper functions ***/

/** 
 * Filesystem sends the messages as structs, we receive them as streams of bytes
 * This function parses them as JS objects
 **/ 
const parseMessage = (data) => {
    /* We need only the keys, will replace values with actual values */
    const message = {...MessageFormat};
    let idx = 0;
    for(const field in MessageFormat) {
      const {type, length}= MessageFormat[field];
      message[field] = data.slice(idx, idx + length);
      switch(type) {
          case MESSAGEFIELDTYPES.STRING:
              /* Null char indicates end of data */
              const nullIdx = message[field].indexOf('\x00');
              if (nullIdx == -1 ) {
                message[field] = utf8ArrayToString(message[field]);
              } else {
                message[field] = utf8ArrayToString(message[field].slice(0, nullIdx));
              }
              
      }
      idx += length;
    }
    return message;
}

const utf8ArrayToString = (function() {
    const decoder = new TextDecoder("utf-8");
    return utf8 => decoder.decode(utf8);
})();

connectWhatsapp();

module.exports = {
    parseMessage,
    MessageFormat,
    MESSAGEFIELDTYPES
}