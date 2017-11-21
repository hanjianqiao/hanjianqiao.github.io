---
layout: post
title:  "Program with Linux Namespacee"
date:   2017-11-11 17:00:00 +0800
categories: Linux
---

***Introduce to Namespace and program with it***




# Linux Namespce

A namespace wraps a global system resource in an abstraction that makes it appear to the processes within the namespace that they have. their own isolated instance of the global resource.  Changes to the global resource are visible to other processes that are members of the namespace, but are invisible to other processes.  One use of namespaces is to implement containers.

Linux provides the following namespaces:

```
Namespace   Constant          Isolates
Cgroup      CLONE_NEWCGROUP   Cgroup root directory
IPC         CLONE_NEWIPC      System V IPC, POSIX message queues
Network     CLONE_NEWNET      Network devices, stacks, ports, etc.
Mount       CLONE_NEWNS       Mount points
PID         CLONE_NEWPID      Process IDs
User        CLONE_NEWUSER     User and group IDs
UTS         CLONE_NEWUTS      Hostname and NIS domain name
```

# Program examples

***We make it by call clone()***

## 1. Cgroup namespaces (CLONE_NEWCGROUP) (since Linux 2.6.19)

## 2. IPC namespaces (CLONE_NEWIPC) (since Linux 2.6.19)

## 3. Network namespaces (CLONE_NEWNET) (since Linux 2.6.24)

## 4. Mount namespaces (CLONE_NEWNS) (since Linux 2.4.19)

## 5. PID namespaces (CLONE_NEWPID) (since Linux 2.6.24)

## 6. User namespaces (CLONE_NEWUSER) （Start in Linux 2.6.23, Complete in Linux 3.8）

## 7. UTS namespaces (CLONE_NEWUTS) (since Linux 2.6.19)
