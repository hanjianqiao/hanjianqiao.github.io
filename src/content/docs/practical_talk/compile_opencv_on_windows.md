---
title: Windows下编译OpenCV
description: Get started building your docs site with Starlight.
template: doc
---

## OpenCV介绍

OpenCV库分为“稳定”部分跟“不稳定”部分。不稳定部分包含了新模块，但是通常没有稳定的 API，并且没有经过良好的测试。 因此，它们不应该作为官方 OpenCV 发行版的一部分发布，因为OpenCV库保持二进制兼容性，并尝试提供良好的性能和稳定性。因此，所有新模块都应该单独开发，并首先发布在 opencv_contrib 存储库中。 后来，当该模块成熟并受到欢迎时，它被移至稳定的 OpenCV 存储库，开发团队为此模块提供生产质量的支持。

## 编译步骤

> 如果需要使用还未稳定的模块，需要参照以下指引自己编译OpenCV
> 如果稳定版即可满足要求，推荐直接下载官方二进制包

* 下载源码
```
https://github.com/opencv/opencv
https://github.com/opencv/opencv_contrib
```
上面分别时opencv跟opencv_contrib的GitHub链接。需要注意的是，下载的两部分源码最好要保持一致的git tag。opencv库提供了release，当然，也可以checkout到所需的tag，但是opencv_contrib没有release，所以在下载的时候注意选择对应的tag。
下载完成后，解压到不包含空格及中文字符的路径下，否则会出现一些意外的问题。2、配置
推荐电脑上先安装这些：VS2022、cmake、python（注意：安装模式选择“仅为我安装”，否则pip的时候需要管理员权限，会引起很多不必要的麻烦）
cmd到一个空的文件夹，可以任意指定，执行下面的命令进行配置
```bash
cmake -G "Visual Studio 16 2019" \
      -DOPENCV_EXTRA_MODULES_PATH=E:\Downloads\opencv_contrib-4.9.0\opencv_contrib-4.9.0\modules \
      -DCMAKE_CONFIGURATION_TYPES="Debug;Release" \
      E:\Downloads\opencv-4.9.0\opencv-4.9.0
```
过程中可能会出现问题，其中一个比较常见：下载错误（Couldn't download files from the Internet.）这时候打开紧接着的文件，大概是这个名字：`D:/temp/CMakeDownloadLog.txt`
里面会有输出，说明从什么路径下载什么文件时候失败，这时候需要手动下载（或者能够给你的网络全局科学上网）：
大概是：`Download "path/aaaa.zip" from "url/bbb"`这样的信息，这时候，需要手动把下载失败的下载下来，并且保存到`path/aaaa.zip`这个位置，注意改文件名（提示：往往这些文件已经存在，但是大小为0）

* 编译
用VS2022打开生成的`OpenCV.sln`文件。在菜单栏选择：生成-全部重新生成-2INSTALL。这样是因为需要生成INSTALL这个目标才会把项目可以引用的库跟头文件打包好，否则不能正常把opencv添加到你的项目里。

## Qt中使用OpenCV
* 配置Qt
添加下面的代码到你的CMakeLists.txt中即可：
```cmake
# set(OpenCV_DIR D:/Programs/opencv/build/)
set(OpenCV_DIR D:/temp/install)
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})
target_link_libraries(qt-opecv-learn PRIVATE ${OpenCV_LIBS})
```

* 正常引用头文件编写代码即可：
```c++
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
```