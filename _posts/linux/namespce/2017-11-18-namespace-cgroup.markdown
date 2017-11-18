---
layout: post
title:  "Cgroup namespaces"
date:   2017-11-18 15:17:01 +0800
categories: linux
---

Cgroup namespaces





`This feature requires Linux kernel version >= 4.6`

Cgroup namespaces virtualize the view of a process's cgroups as seen via /proc/[pid]/cgroup and /proc/[pid]/mountinfo.

## example

### set cgroup namespace
```
# mkdir -p /sys/fs/cgroup/freezer/sub
# echo $$                      # Show PID of this shell
22483
# echo $$ > /sys/fs/cgroup/freezer/sub/cgroup.procs
# cat /proc/self/cgroup | grep freezer
7:freezer:/sub
```
### change cgroup namespaces
Current unshare command may not have -C feature, checkout my simple [unshare][lct unshare]

```
# unshare -C bash
```

### check again
```
$ cat /proc/self/cgroup | grep freezer
7:freezer:/
$ cat /proc/1/cgroup | grep freezer
7:freezer:/..
$ cat /proc/20124/cgroup | grep freezer
7:freezer:/../sub2
```

### about mountinfo
However, when we look in /proc/self/mountinfo we see the following anomaly:

```
# cat /proc/self/mountinfo | grep freezer
155 145 0:32 /.. /sys/fs/cgroup/freezer ...
```

The fourth field of this line (/..)  should show the directory in the cgroup filesystem which forms the root of this mount.  Since by the definition of cgroup namespaces, the process's current freezer cgroup directory became its root freezer cgroup directory, we should see '/' in this field.  The problem here is that we are seeing a mount entry for the cgroup filesystem corresponding to our initial shell process's cgroup namespace (whose cgroup filesystem is indeed rooted in the parent directory of sub).  We need to remount the freezer cgroup filesystem inside this cgroup namespace, after which we see the expected results:

```
# mount --make-rslave /     # Don't propagate mount events
                            # to other namespaces
# umount /sys/fs/cgroup/freezer
# mount -t cgroup -o freezer freezer /sys/fs/cgroup/freezer
# cat /proc/self/mountinfo | grep freezer
155 145 0:32 / /sys/fs/cgroup/freezer rw,relatime ...
```

[lct unshare]: hanjianqiao/lct-utils/blob/master/samples/process/namespace/unshare.c
