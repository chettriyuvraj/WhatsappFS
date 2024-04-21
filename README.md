# README


## What is a file system?

- Consider your terminal shell on Linux/Mac/Windows. You can navigate to different folders, figure out their structures, use a number of different command line programs to manipulate stuff (eg. find all directories which start with 'a')

- Loosely, we can say that the file system provides us with an API to interact with the system's physical storage, in a sort-of heirarchical manner.


## Let's get a little creative

- Can we create a file-system like abstraction for something other than our computer's files? Well, when you plug in a USB, you can navigate it's storage as well. But that's just an extension to our normal file system.

- How about our browser? Can you imagine we _ls_ into a folder and it contains all the tabs of our browser, each represented as a file? Now maybe we can _cat_ any of these tabs and get their contents. Check out [TabFS](https://omar.website/tabfs/)

- You get the idea. Instead of a concrete implementation, we can consider the filesystem as simply an interface, implementing it as we see fit.

- Well, how about a file system for Whatsapp? Each chat as a file, maybe read chats, delete chats, hmm....presenting WhatsappFS!


## Structure
_Ignore this for now, I don't think it makes any sense currently_

- chats (use client.getchats)
    - a, b, c ...
        (name: is a property but will be returned as part of entry title)
        (read only)
        - isGroup
        - isMuted
        - timestamp (return in ls -l?)
        - lastMessage
        (exec)
        - mark unread
        - delete -> rm command
        - mute
        - pin
        - sendStateTyping
        (write)
        - write to chat using vim cat etc
    
    


- contacts (gives all contacts)
    - a, b, c ...
        (dir)
        - chat (execute same route as chat)
        (read only)
        - isBlocked
        - isBusiness
        - isEnterprise
        (exec only)
        - block


## Progress

I pick this up after a bit and forget where I am so just as a reminder to myself

- On launching file system using _./whatsappfs -f testdir/_ function whatsapp_init in fs.c initializes a linux queue, this is the main way of passing messages between FUSE server and client
- Any FUSE function e.g. _getattr_ sends a message to message queue using the exchange_json function
- Format of the message:
    - First 4 bytes are the _size_: indicate the length of the JSON as a uint32
    - Remaining _size_ amount of bytes from byte 4 onwards is the JSON
    - On using the svmq library to pick the message out from the message queue in our node client, we also get a bit of gibberish at the end, which gives an error on trying to parse it using Json.parse()
    - This is the reason we are passing the size of the json at the start of the message
- On launching client _node client.js_, the connect function grabs this message from the queue, parses it and prints out the corresponding registered action for the path from _Routes_ object

TODO: exchange_json function must be modified to accept the response from the client, we can do this using a separate queue or the same queue



