---
layout: post
title:  "Introduce to blkio subsystem"
date:   2017-10-21 16:16:01 +0800
categories: linux
---

***Introduce to blkio in detail and giving some usage sample***




## blkio subsystem overview

cgroup subsys "blkio" implements the block io controller. There seems to be a need of various kinds of IO control policies (like proportional BW, max BW) both at leaf nodes as well as at intermediate nodes in a storage hierarchy.

Plan is to use the same cgroup based management interface for blkio controller and based on user options switch IO policies in the background.

Currently two IO control policies are implemented. First one is proportional weight time based division of disk policy. It is implemented in CFQ. Hence this policy takes effect only on leaf nodes when CFQ is being used. The second one is throttling policy which can be used to specify upper IO rate limits on devices. This policy is implemented in generic block layer and can be used on leaf nodes as well as higher level logical devices like device mapper.

```
$ ls /sys/fs/cgroup/blkio/ -al
total 0
dr-xr-xr-x  5 root root   0 Oct 19 21:10 .
drwxr-xr-x 13 root root 340 Oct 19 18:05 ..
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_merged
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_merged_recursive
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_queued
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_queued_recursive
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_service_bytes
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_service_bytes_recursive
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_serviced
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_serviced_recursive
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_service_time
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_service_time_recursive
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_wait_time
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.io_wait_time_recursive
-rw-r--r--  1 root root   0 Oct 19 21:13 blkio.leaf_weight
-rw-r--r--  1 root root   0 Oct 19 21:13 blkio.leaf_weight_device
--w-------  1 root root   0 Oct 19 21:13 blkio.reset_stats
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.sectors
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.sectors_recursive
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.throttle.io_service_bytes
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.throttle.io_serviced
-rw-r--r--  1 root root   0 Oct 19 18:05 blkio.throttle.read_bps_device
-rw-r--r--  1 root root   0 Oct 19 18:05 blkio.throttle.read_iops_device
-rw-r--r--  1 root root   0 Oct 19 18:05 blkio.throttle.write_bps_device
-rw-r--r--  1 root root   0 Oct 19 18:05 blkio.throttle.write_iops_device
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.time
-r--r--r--  1 root root   0 Oct 19 21:13 blkio.time_recursive
-rw-r--r--  1 root root   0 Oct 19 18:05 blkio.weight
-rw-r--r--  1 root root   0 Oct 19 18:05 blkio.weight_device
-rw-r--r--  1 root root   0 Oct 19 21:13 cgroup.clone_children
-rw-r--r--  1 root root   0 Oct 19 18:30 cgroup.procs
-r--r--r--  1 root root   0 Oct 19 21:13 cgroup.sane_behavior
drwxr-xr-x  2 root root   0 Oct 19 18:05 init.scope
-rw-r--r--  1 root root   0 Oct 19 21:13 notify_on_release
-rw-r--r--  1 root root   0 Oct 19 21:13 release_agent
drwxr-xr-x 64 root root   0 Oct 19 18:05 system.slice
-rw-r--r--  1 root root   0 Oct 19 21:13 tasks
drwxr-xr-x  2 root root   0 Oct 19 18:05 user.slice
```

## Use blkio subsystem

*In general, cgroups are mounted automatically at ubuntu boot time.*

### Set weight

- Create two cgroups
	mkdir -p /sys/fs/cgroup/blkio/test1/ /sys/fs/cgroup/blkio/test2

- Set weights of group test1 and test2
	echo 500 > /sys/fs/cgroup/blkio/test1/blkio.weight
	echo 1000 > /sys/fs/cgroup/blkio/test2/blkio.weight

- Create two same size files (say 512MB each) on same disk (file1, file2) and
  launch two dd threads in different cgroup to read those files.
	- Create file, choose your own path

		```
		dd if=/dev/zero of=/home/lct/tmp/zerofile1 bs=1M count=512
		dd if=/dev/zero of=/home/lct/tmp/zerofile2 bs=1M count=512
		```
		
	```
	sync
	echo 3 > /proc/sys/vm/drop_caches

	dd if=/home/lct/tmp/zerofile1 of=/dev/null &
	echo $! > /sys/fs/cgroup/blkio/test1/tasks
	cat /sys/fs/cgroup/blkio/test1/tasks

	dd if=/home/lct/tmp/zerofile2 of=/dev/null &
	echo $! > /sys/fs/cgroup/blkio/test2/tasks
	cat /sys/fs/cgroup/blkio/test2/tasks
	```

- At macro level, first dd should finish first. To get more precise data, keep
  on looking at (with the help of script), at blkio.disk_time and
  blkio.disk_sectors files of both test1 and test2 groups. This will tell how
  much disk time (in milliseconds), each group got and how many sectors each
  group dispatched to the disk. We provide fairness in terms of disk time, so
  ideally io.disk_time of cgroups should be in proportion to the weight.
  

### Limit read/write speed
- Specify a bandwidth rate on particular device for root group. The format
  for policy is "<major>:<minor>  <bytes_per_second>".

        echo "8:16  1048576" > /sys/fs/cgroup/blkio/blkio.throttle.read_bps_device

  Above will put a limit of 1MB/second on reads happening for root group
  on device having major/minor number 8:16.

- Run dd to read a file and see if rate is throttled to 1MB/s or not.

        # dd iflag=direct if=/mnt/common/zerofile of=/dev/null bs=4K count=1024
        1024+0 records in
        1024+0 records out
        4194304 bytes (4.2 MB) copied, 4.0001 s, 1.0 MB/s

 Limits for writes can be put using blkio.throttle.write_bps_device file.


