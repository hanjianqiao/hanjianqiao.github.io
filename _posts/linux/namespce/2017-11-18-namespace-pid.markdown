---
layout: post
title:  "PID namespace"
date:   2017-11-18 16:55:01 +0800
categories: linux
---

PID namespace



## Overview
If CLONE_NEWPID is set, then create the process in a new PID namespace.  If this flag is not set, then (as with fork(2)) the process is created in the same PID namespace as the calling process.  This flag is intended for the implementation of containers.
