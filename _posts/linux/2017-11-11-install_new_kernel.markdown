---
layout: post
title:  "阿里云编译新内核"
date:   2017-11-17 21:46:01 +0800
categories: linux
---

阿里云源码编译新内核




## 1、环境准备

下载Linux内核源代码：

```
wget http://mirrors.aliyun.com/linux-kernel/v4.x/linux-4.13.tar.xz
wget http://mirrors.aliyun.com/linux-kernel/v4.x/patch-4.13.xz
```

安装必要软件包：

```
sudo apt-get install kernel-package build-essential libncurses5-dev fakeroot libssl-dev bc
```

## 2、解压源码和补丁，给内核打补丁

```
xz -d linux-4.13.tar.xz
tar -xvf linux-4.13.tar
sudo mv linux-4.13 /usr/src
sudo mv patch-4.13.xz /usr/src
cd /usr/src/
sudo xz -d patch-4.13.xz | patch -p1
```

## 3、配置源码

```
sudo cp linux-headers-4.4.0-98-generic/.config linux-4.13/
cd linux-4.13/
make menuconfig
```

load->OK->Save->OK->EXIT

## 4、编译安装新内核

```
make bzImage -j16
make modules -j16
```

```
sudo make modules_install
sudo make install
sudo mkinitramfs 4.13.0 -o /boot/initrd.img-4.13.0
sudo update-grub2
```

## 5、重启验证安装

```
sudo reboot
```

*如果是云服务器，上面的重启指令可能失效。遇到这种情况，可以在控制台中物理重启机器*
