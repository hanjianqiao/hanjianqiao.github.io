---
layout: post
title:  "UTS namespace"
date:   2017-11-18 17:01:01 +0800
categories: linux
---

UTS namespace



## Overview
If CLONE_NEWUTS is set, then create the process in a new UTS namespace, whose identifiers are initialized by duplicating the identifiers from the UTS namespace of the calling process. If this flag is not set, then (as with fork(2)) the process is created in the same UTS namespace as the calling process. This flag is intended for the implementation of containers.

A UTS namespace is the set of identifiers returned by uname(2); among these, the domain name and the hostname can be modified by setdomainname(2) and sethostname(2), respectively. Changes made to the identifiers in a UTS namespace are visible to all other processes in the same namespace, but are not visible to processes in other UTS namespaces.
