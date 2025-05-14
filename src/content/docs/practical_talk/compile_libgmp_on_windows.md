---
title: Windows下编译GMP
description: Get started building your docs site with Starlight.
template: doc
---

## 环境准备

* Windows使用Linux的代码，需要用`MSYS2 MINGW64 Shell`来进行编译
* MINGW生成的文件主要为
  * .dll.a：Mingw下使用的库
  * .dll：dll文件，Windows下可以直接使用
  * .dll.def：包含导出符号信息，用来生成Windows下的dll配套符号lib；如果没有这个文件，可以使用`gendef`来生成
* Windows下的`.lib`文件生成
  
  ```bash
  # 以`libgmp`为例，编译后会生成`libgmp-3.dll.def`、`libgmp-10.dll`、`libgmp.dll.a`
  # 生成的文件`libgmp-3.dll.def`需要改名为`libgmp-10.def`，否则，生成的`.lib`文件回去找`libgmp-3.dll.dll`，二进制打开`.lib`能看到具体信息
  # 推测这是`lib.exe`工具的默认约定：根据文件名生成
  # 下面命令需要使用：x64 Native Tools Command Prompt for VS 2019
  lib /def:libgmp-10.def /out:libgmp-10.lib
  ```

* MSYS2安装工具
  * `pacman -S mingw-w64-x86_64-tools`：包含`gendef`
  * `pacman -S mingw-w64-x86_64-gcc`
  * `pacman -S mingw-w64-x86_64-gmp`
  * `pacman -S base-devel`

## gmp

```bash
./configure --enable-shared --disable-static --enable-cxx --prefix=$HOME/installed/gmp
make && make install # 为了编译对应的mpfr
```

```bash
# https://gmplib.org/manual/Notes-for-Particular-Systems
# x64 Native Tools Command Prompt for VS 2019
# 通过 /name 指令.lib导入的dll名称
lib /machine:x64 /name:libgmp-10 /def:libgmp-3.dll.def /out:libgmp-10.lib
lib /machine:x64 /name:libgmpxx-4 /def:libgmpxx-3.dll.def /out:libgmpxx-4.lib
```

## mpfr

```bash
./configure --with-gmp=$HOME/installed/gmp
make
```
