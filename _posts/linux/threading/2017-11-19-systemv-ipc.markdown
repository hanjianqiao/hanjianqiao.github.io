---
layout: post
title:  "System V interprocess communication mechanisms"
date:   2017-11-19 13:25:01 +0800
categories: Linux
---

***System V interprocess communication mechanisms***




## System V message queue

The msgsnd() and msgrcv() system calls are used, respectively, to send messages to, and receive messages from, a System V message queue.  The calling process must have write permission on the message queue in order to send a message, and read permission to receive a message.

The msgp argument is a pointer to a caller-defined structure of the following general form:

```
struct msgbuf {
   long mtype;       /* message type, must be > 0 */
   char mtext[1];    /* message data */
};
```

The mtext field is an array (or other structure) whose size is specified by msgsz, a nonnegative integer value.  Messages of zero length (i.e., no mtext field) are permitted.  The mtype field must have a strictly positive integer value.  This value can be used by the receiving process for message selection.
