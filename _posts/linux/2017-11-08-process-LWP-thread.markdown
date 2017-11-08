---
layout: post
title:  "Linux: Process, LWP(Light Weight Process), and Thread"
date:   2017-11-08 16:16:01 +0800
categories: Linux
---

***Linux：进程、轻量级进程和线程***




# Linux进程
简单来说，Linux进程可以看作是程序执行的实体。例如，打开一个文本编辑器，就是启动了一个进程。
进程是Linux最基础的执行流。进程拥有一个属性，内核用该属性进行切换。进程间通信可以通过IPC和类似共享内存的技术。

# Linux轻量级进程和线程
线程是进程的一个执行流。一个进程可以包含多个线程，称为多线程进程；一个进程如果只包含一个线程，则称为单线程进程。Linux内核中并没有线程的概念，每个线程在内核看来都是几乎与进程一致。



