---
layout: post
title:  "Cgroup IPC"
date:   2017-11-18 16:10:01 +0800
categories: linux
---

Cgroup IPC



## Overview

If CLONE_NEWIPC is set, then create the process in a new IPCnamespace.  If this flag is not set, then (as with fork(2)),the process is created in the same IPC namespace as thecalling process.  This flag is intended for the implementation
of containers.

An IPC namespace provides an isolated view of System V IPCobjects (see svipc(7)) and (since Linux 2.6.30) POSIX messagequeues (see mq_overview(7)).  The common characteristic ofthese IPC mechanisms is that IPC objects are identified bymechanisms other than filesystem pathnames.

Objects created in an IPC namespace are visible to all otherprocesses that are members of that namespace, but are notvisible to processes in other IPC namespaces.

When an IPC namespace is destroyed (i.e., when the lastprocess that is a member of the namespace terminates), all IPCobjects in the namespace are automatically destroyed.

Only a privileged process (CAP_SYS_ADMIN) can employCLONE_NEWIPC.  This flag can't be specified in conjunctionwith CLONE_SYSVSEM.
