const MessageQueue = require('svmq');
const { Client } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');

/*** General Constants ***/

const unix = {
    /* Unix file types */
    S_IFMT: parseInt('0170000',8),   /* type of file mask */
    S_IFIFO: parseInt('010000', 8),   /* named pipe (fifo) */
    S_IFCHR: parseInt('020000', 8),   /* character special */
    S_IFDIR: parseInt('040000', 8),   /* directory */
    S_IFBLK: parseInt('060000', 8),   /* block special */
    S_IFREG: parseInt('0100000',8),  /*  regular */
    S_IFLNK: parseInt('0120000',8),  /*  symbolic link */
    S_IFSOCK: parseInt('0140000',8), /*  socket */
  }

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
// const ResponseFormat = {
//     data: {},
//     path: {
//         type: MESSAGEFIELDTYPES.STRING,
//         length: 100
//     }
// };
const Routes = {};
const cache = {
    chats: [],
    contacts: [],
};

/*** Routes ***/
Routes['/chats'] = {
    description: 'List of all chats of the user',
    usage: 'ls',
    getattr() {
        return {
            st_mode: unix.ST_IFDIR,
            st_nlink: 3,
            st_size: 0
        }
    },
    async readdir(client) {
        const chats = await client.getChats();
        return ['.', '..', ...chats.map(chat => chat.name)];
    }
}

/*** Core functions ***/

const connectWhatsapp = (client) => {
    client.initialize();
    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, {small: true});
    });
}

const setupEventResponses = async (client) => {
    client.once('ready', async () => {
        console.log('Client is ready!');
        connect(client);
    });
}

const cacheChatsAndContactsGlobally = async (client) => {
    chats, contacts = await client.getChats(), await client.getContacts();
    cache[chats] = chats;
    cache[contacts] = contacts;
}

/**
 * Pop message off the queue and parse them
 **/
const connect = async (client) => {
    // const queue = MessageQueue.open(MESSAGEQUEUEKEY);
    // queue.pop({ type: FILESYSMESSAGETYPE }, (err, data) => {
    //     s = utf8ArrayToString(data);
    //     const message = JSON.parse(s);
    //     console.log(message);
    // });
    const queue = [{
        action: 'readdir',
        path: '/chats'
    },
    {
        action: 'readdir',
        path: '/chats'
    },
    {
        action: 'readdir',
        path: '/chats'
    }]

    for (let i = 0; i < queue.length; i++) {
        const {action, path} = queue[i];
        const res = await Routes[path][action](client);
        console.log("\n\nResult of ith action is " + JSON.stringify(res));
    }
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

if (require.main == module) {
    const client = new Client();
    connectWhatsapp(client);
    setupEventResponses(client);
}



module.exports = {
    parseMessage,
    MessageFormat,
    MESSAGEFIELDTYPES,
    Routes
}