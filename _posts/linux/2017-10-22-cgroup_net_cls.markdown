---
layout: post
title:  "Introduce to net_cls subsystem"
date:   2017-10-22 19:00:00 +0800
categories: linux
---
***Network classifier cgroup (net_cls)***





## What is net_cls

The Network classifier cgroup provides an interface to
tag network packets with a class identifier (classid).

The Traffic Controller (tc) can be used to assign
different priorities to packets from different cgroups.
Also, Netfilter (iptables) can use this tag to perform
actions on such packets.

Creating a net_cls cgroups instance creates a net_cls.classid file.
This net_cls.classid value is initialized to 0.

## Control scp netwoerk speed

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


## Sample with tc and iptables

You can write hexadecimal values to net_cls.classid; the format for these
values is 0xAAAABBBB; AAAA is the major handle number and BBBB
is the minor handle number.
Reading net_cls.classid yields a decimal result.

Example:
mkdir /sys/fs/cgroup/net_cls
mount -t cgroup -onet_cls net_cls /sys/fs/cgroup/net_cls
mkdir /sys/fs/cgroup/net_cls/0
echo 0x100001 >  /sys/fs/cgroup/net_cls/0/net_cls.classid
	- setting a 10:1 handle.

cat /sys/fs/cgroup/net_cls/0/net_cls.classid
1048577

configuring tc:
tc qdisc add dev eth0 root handle 10: htb

tc class add dev eth0 parent 10: classid 10:1 htb rate 40mbit
 - creating traffic class 10:1

tc filter add dev eth0 parent 10: protocol ip prio 10 handle 1: cgroup

configuring iptables, basic example:
iptables -A OUTPUT -m cgroup ! --cgroup 0x100001 -j DROP

```
export DEV=eth0

tc qdisc add dev $DEV root handle 1: cbq avpkt 1000 bandwidth 10mbit 

tc class add dev $DEV parent 1: claslsid 1:1 cbq rate 512kbit \
allot 1500 prio 5 bounded isolated 

tc filter add dev $DEV parent 1: protocol ip prio 16 u32 \
match ip dst 10.25.66.191 flowid 1:1
```