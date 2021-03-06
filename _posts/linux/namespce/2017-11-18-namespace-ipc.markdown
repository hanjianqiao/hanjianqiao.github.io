---
layout: post
title:  "IPC namespace"
date:   2017-11-18 16:10:01 +0800
categories: linux
---

IPC namespace



## Overview

If CLONE_NEWIPC is set, then create the process in a new IPC namespace.  If this flag is not set, then (as with fork(2)),the process is created in the same IPC namespace as the calling process.  This flag is intended for the implementation
of containers.

An IPC namespace provides an isolated view of System V IPC objects (see svipc(7)) and (since Linux 2.6.30) POSIX message queues (see mq_overview(7)).  The common characteristic of these IPC mechanisms is that IPC objects are identified by mechanisms other than filesystem pathnames.

Objects created in an IPC namespace are visible to all otherprocesses that are members of that namespace, but are notvisible to processes in other IPC namespaces.

When an IPC namespace is destroyed (i.e., when the lastprocess that is a member of the namespace terminates), all IPCobjects in the namespace are automatically destroyed.

Only a privileged process (CAP_SYS_ADMIN) can employCLONE_NEWIPC.  This flag can't be specified in conjunctionwith CLONE_SYSVSEM.
