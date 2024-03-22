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
- chats (use client.getchats)
    - a, b, c ...
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
