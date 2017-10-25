---
layout: post
title:  "Sample: Use cgroup cpu subsystem to control cpu usage"
date:   2017-10-25 16:00:00 +0800
categories: linux
---

***使用cgroup限制CPU使用的例子***




## 通过cgroup控制CPU使用

### 1、首先看一个例子：

```
// file: loop_count.c

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int forker(int nprocesses)
{
    pid_t pid;
    if(nprocesses > 0)
    {
        if ((pid = fork()) < 0)
        {
            perror("fork");
        }
        else if (pid == 0)
        {
            //Child stuff here
            //printf("Child %d end\n", nprocesses);
        }
        else if(pid > 0)
        {
            //parent
            forker(nprocesses - 1);
        }
    }
    return nprocesses;
}
int main(int argc, char **argv){
	int count = 100000000;
	int loop = 0;
    int nchild = 5;
    if(argc > 1){
        nchild = atoi(argv[1]);
    }
    forker(nchild);
    int id = getpid();
	while(1){
		for(int i = 0; i < count; i++){
			// do nothing
		}
		printf("id %d loop: %d\n", id, loop++);
	}
	return 0;
}
```

编译运行（我用的服务器是4核，所以开3个子线程）：

```
gcc loop_count.c
./a.out 3
```

输出，可以看到四个线程的计数刚开始基本一致，慢慢有一些差值。
![image](https://user-images.githubusercontent.com/7146341/31995360-ab64b4be-b9b6-11e7-92a6-0fa8e69e6b54.png)

运行`top`命令，查看cpu使用情况：
![image](https://user-images.githubusercontent.com/7146341/31995308-77003338-b9b6-11e7-8bbb-64fb3820f99c.png)

完美！可以看到4个核心均被占满，没个线程基本上使用到了100%的CPU。

再看一下运行8个线程（2x核心数）的情况：
8个线程均分CPU资源，每个线程占约50%。
![image](https://user-images.githubusercontent.com/7146341/31995695-14cc82d2-b9b8-11e7-8744-8c4b87ba09dc.png)

![image](https://user-images.githubusercontent.com/7146341/31995702-1e140b62-b9b8-11e7-8f6e-48dc273bd3c1.png)


### 2、如果线程数不是CPU核心整数倍

```
gcc loop_count.c
./a.out 5
```

看一下输出和top信息：
![image](https://user-images.githubusercontent.com/7146341/31996111-bfd5b8c8-b9b9-11e7-860d-1b824833c802.png)

![image](https://user-images.githubusercontent.com/7146341/31996129-cce3b204-b9b9-11e7-9384-5042e6309c98.png)

可见，内核依然尽力均分CPU资源。但是毕竟平均能力有限，还是有比较大的误差的。

### 3、如果我们想要各个线程还是使用相同的CPU，有什么办法呢？

*cgroup！*

启动6个线程：

```
gcc loop_count.c
./a.out 5
```

打开新的终端，运行下面的命令：

```
# 需要使用root权限
su
# 新建cpuset子控制组foo
mkdir /sys/fs/cgroup/cpuset/foo
# 该组可以使用CPU核心：0、1和2
echo 0,1,2 > /sys/fs/cgroup/cpuset/foo/cpuset.cpus
# 这个是必要的，这里先不解释
echo 0 > /sys/fs/cgroup/cpuset/foo/cpuset.mems
# 将运行的6个线程加入到foo控制组里面，格式echo PID > cgroup_path
echo 23931 > /sys/fs/cgroup/cpuset/foo/tasks
echo 23932 > /sys/fs/cgroup/cpuset/foo/tasks
echo 23933 > /sys/fs/cgroup/cpuset/foo/tasks
echo 23934 > /sys/fs/cgroup/cpuset/foo/tasks
echo 23935 > /sys/fs/cgroup/cpuset/foo/tasks
echo 23936 > /sys/fs/cgroup/cpuset/foo/tasks
```

有意思的事情发生了：
![image](https://user-images.githubusercontent.com/7146341/31996646-d844e90e-b9bb-11e7-9d2c-b6c9a887fc36.png)

每个线程都占50%CPU，而且CPU3空闲。

### 4、更精确的控制

上面，我们使得每个CPU核心运行相同的任务，以达到平均的CPU使用率。更进一步，我们可以使用cgroup提供的另一个功能实现：

```
gcc loop_count.c
./a.out 5
```

打开新的终端，运行下面的命令：

```
# 需要使用root权限
su

# 下面，为每个线程建立一个控制组，每个控制组可使用30%的CPU
# 新建cpuset子控制组foo
# thread 0
mkdir /sys/fs/cgroup/cpu/foo0
echo 1000000 > /sys/fs/cgroup/cpu/foo0/cpu.cfs_period_us
echo 300000 > /sys/fs/cgroup/cpu/foo0/cpu.cfs_quota_us
echo 24187 > /sys/fs/cgroup/cpu/foo0/tasks
# thread 1
mkdir /sys/fs/cgroup/cpu/foo1
echo 1000000 > /sys/fs/cgroup/cpu/foo1/cpu.cfs_period_us
echo 300000 > /sys/fs/cgroup/cpu/foo1/cpu.cfs_quota_us
echo 24188 > /sys/fs/cgroup/cpu/foo1/tasks
# thread 2
mkdir /sys/fs/cgroup/cpu/foo2
echo 1000000 > /sys/fs/cgroup/cpu/foo2/cpu.cfs_period_us
echo 300000 > /sys/fs/cgroup/cpu/foo2/cpu.cfs_quota_us
echo 24189 > /sys/fs/cgroup/cpu/foo2/tasks
# thread 3
mkdir /sys/fs/cgroup/cpu/foo3
echo 1000000 > /sys/fs/cgroup/cpu/foo3/cpu.cfs_period_us
echo 300000 > /sys/fs/cgroup/cpu/foo3/cpu.cfs_quota_us
echo 24190 > /sys/fs/cgroup/cpu/foo3/tasks
# thread4
mkdir /sys/fs/cgroup/cpu/foo4
echo 1000000 > /sys/fs/cgroup/cpu/foo4/cpu.cfs_period_us
echo 300000 > /sys/fs/cgroup/cpu/foo4/cpu.cfs_quota_us
echo 24191 > /sys/fs/cgroup/cpu/foo4/tasks
# thread5
mkdir /sys/fs/cgroup/cpu/foo5
echo 1000000 > /sys/fs/cgroup/cpu/foo5/cpu.cfs_period_us
echo 300000 > /sys/fs/cgroup/cpu/foo5/cpu.cfs_quota_us
echo 24192 > /sys/fs/cgroup/cpu/foo5/tasks
```

![image](https://user-images.githubusercontent.com/7146341/31998007-b7ddb308-b9c0-11e7-9986-254e18146250.png)

虽然方法有些笨拙，但可以看到CPU占用率控制在30%左右。

### 总结

cgroup可以比较方便精确地控制线程的CPU占用率，更多的cgroup细节可以参考相关内核文档，我的博客也会继续做一些补充。
