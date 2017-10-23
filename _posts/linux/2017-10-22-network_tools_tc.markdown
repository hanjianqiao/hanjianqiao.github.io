---
layout: post
title:  "Case study: network traffic control using tc"
date:   2017-10-22 19:00:00 +0800
categories: linux
---
***tc provides functions to control traffic***




## Overview

## Samples

### add delay to network

```
# tc -s qdisc ls dev eth0
# ping you.server
# tc qdisc add dev eth0 root netem delay 200ms
# ping you.server
```
see what happens to ping delay
