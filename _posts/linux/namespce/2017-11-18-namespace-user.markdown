---
layout: post
title:  "User namespace"
date:   2017-11-18 17:01:01 +0800
categories: linux
---

User namespace



## Overview
(This flag first became meaningful for clone() in Linux 2.6.23, the current clone() semantics were merged in Linux 3.5, and the final pieces to make the user namespaces completely usable were merged in Linux 3.8.)

If CLONE_NEWUSER is set, then create the process in a new user namespace.  If this flag is not set, then (as with fork(2)) the process is created in the same user namespace as the calling process.

Before Linux 3.8, use of CLONE_NEWUSER required that the caller have three capabilities: CAP_SYS_ADMIN, CAP_SETUID, and CAP_SETGID.  Starting with Linux 3.8, no privileges are needed to create a user namespace.

This flag can't be specified in conjunction with CLONE_THREAD or CLONE_PARENT.  For security reasons, CLONE_NEWUSER cannot be specified in conjunction with CLONE_FS.
