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
# tc -s qdisc ls dev eth1
# ping you.server
# tc qdisc add dev eth0 root netem delay 200ms
# ping you.server
```
see what happens to ping delay


### control scp speed

Enbale tc on eth1, and set some limit

```
tc -s qdisc ls dev eth1
tc qdisc add dev eth1 root handle 3:0 htb default 3
tc class add dev eth1 parent 3:0 classid 3:0 htb rate 700kbps ceil 800kbps prio 0
tc class add dev eth1 parent 3:0 classid 3:1 htb rate 100kbps ceil 200kbps prio 0
tc class add dev eth1 parent 3:0 classid 3:2 htb rate 200kbps ceil 300kbps prio 0
tc class add dev eth1 parent 3:0 classid 3:3 htb rate 300kbps ceil 400kbps prio 0
```

Make it works with cgroup

```
mkdir /sys/fs/cgroup/net_cls,net_prio/foo
tc filter add dev eth1 protocol ip parent 3:0 prio 1 handle 3:3 cgroup
```


Test scp time

```
time scp file user@another.server:/your_path
```

default is 3:3, so you get around 300kbps speed

Switch to group and check speed

get current bash pid
```
ps
```

set cgroup, and let cgroup to 3:1

```
echo 0x00030001 > /sys/fs/cgroup/net_cls,net_prio/foo/net_cls.classid
echo ${pid} > /sys/fs/cgroup/net_cls,net_prio/foo/tasks
```

check scp speed

```
time scp file user@another.server:/your_path
```

you get speed arount 100kbps
