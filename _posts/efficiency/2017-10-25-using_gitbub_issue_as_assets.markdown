---
layout: post
title:  "Using github Issue as your assets"
date:   2017-10-25 11:00:00 +0800
categories: efficiency
---

***使用GitHub Issue作为素材存储***




## 使用Github Issue存储图片等文件

使用GitHub等项目管理平台时总需要书写ReadMe、Wiki，这时候经常需要一些图片。但是，图片要怎么存储呢？

这里介绍一下使用Github Issue来作为图片存储的方式。

### 举个例子

编写本篇文章的过程中，需要一些Github操作截图，更好的介绍使用方式。下面介绍一下流程：

#### 1. 转到你的项目（源码项目或者Pages），选择 Issues ==> New issue 来创建一个新的Issue
![image](https://user-images.githubusercontent.com/7146341/31978762-76773740-b975-11e7-93f4-ba7818c3b986.png)

#### 2. 命名你的Issue并完成创建
![image](https://user-images.githubusercontent.com/7146341/31978920-81a83320-b976-11e7-8d1d-4a005d5ee7f4.png)

#### 3. 我们暂时离开Issue，去获取我们的图片资源
##### 3.1 图片文件
这个不用说了，自己绘制的图片或者拍摄的照片或者从网上下载的图片
#### 3.2 屏幕截图
![image](https://user-images.githubusercontent.com/7146341/31979138-aa59fa14-b977-11e7-9e3d-6de1b05d38bb.png)

电脑系统一般自带截图工具，但不推荐，推荐使用某Q或者某信，优点之一是你可以直接编辑截图内容而不用保存文件，具体使用方法请自行搜索

上图就是使用某信截图。这个截图用了两次截图，中间macdown是某信截图，然后整个图片是使用mac自带截图工具捕获的

#### 4. 上传图片
##### 4.1 拖拽文件至评论框，或者点击 select item 进行文件选择
![image](https://user-images.githubusercontent.com/7146341/31979450-66d34032-b979-11e7-8e3e-b2e13ec5b5a7.png)
##### 4.2 使用截图工具后，截图保存在剪切板，直接在评论框使用 Ctrl+v 组合键（根据不同系统选择）
![image](https://user-images.githubusercontent.com/7146341/31979592-07afc354-b97a-11e7-93e0-48d6b8468a51.png)
稍等，Uploading结束后就可以Comment了。

#### 5. 使用图片
在上述步骤上传的每个comment中，点击编辑按钮，如下图：
![image](https://user-images.githubusercontent.com/7146341/31979702-9ef6ba60-b97a-11e7-8bdb-cedad9eb13d2.png)
都可以看到图片的地址，如下图：
![image](https://user-images.githubusercontent.com/7146341/31979714-b5e83b40-b97a-11e7-87e0-8fe01a64b6c6.png)
如果你也在使用markdown编辑，那么可以直接复制其中的代码到你需要的地方
![image](https://user-images.githubusercontent.com/7146341/31979772-05ee359a-b97b-11e7-8cae-5f8819a0518a.png)

### 总结
图片等文件一般来说不需要进行版本控制，所以使用Issue比将图片直接存储到git项目中更加合适。

如果你希望书写的文档能更好的表达，使用这种方法是个不错的选择。


