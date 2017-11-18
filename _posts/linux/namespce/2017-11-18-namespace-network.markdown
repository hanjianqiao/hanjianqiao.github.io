---
layout: post
title:  "Network namespace"
date:   2017-11-18 16:35:01 +0800
categories: linux
---

Network namespace



## Overview
If CLONE_NEWNET is set, then create the process in a new network namespace.  If this flag is not set, then (as with fork(2)) the process is created in the same network namespace as the calling process.  This flag is intended for the implementation of containers.

A network namespace provides an isolated view of the networking stack (network device interfaces, IPv4 and IPv6 protocol stacks, IP routing tables, firewall rules, the /proc/net and /sys/class/net directory trees, sockets, etc.). A physical network device can live in exactly one network namespace.  A virtual network device ("veth") pair provides a pipe-like abstraction that can be used to create tunnels between network namespaces, and can be used to create a bridge to a physical network device in another namespace.

When a network namespace is freed (i.e., when the last process in the namespace terminates), its physical network devices are moved back to the initial network namespace (not to the parent of the process).  For further information on network namespaces, see namespaces(7).
