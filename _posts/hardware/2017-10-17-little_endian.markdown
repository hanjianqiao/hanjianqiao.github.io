---
layout: post
title:  "Endian"
date:   2017-10-17 00:17:01 +0800
categories: hardware
---

***Endian（小端序）***




## 数据在内存中的存储方式

以通用x86机器为例，数据在内存中的表示是小端序（Little-Endian）。

例如：int i = 0x0a0b0c0d;

i的地址存放了四个字节，值分别为0x0a、0x0b、0x0c、0x0d。

假设i的地址为addr，由于小端序低位字节保存在低地址，所以各子节地址为：

```
0x0a：addr+3
0x0b：addr+2
0x0c：addr+1
0x0d：addr+0
```

下面是实例代码说明：

{% highlight c++ %}
#include <iostream>
#include <stdio.h>
using namespace std;

int main(){
    int i = 0x0a0b0c0d;
    int *ip = &i;
    short *sp = (short*)&i;
    char *cp = (char*)&i;
    
    printf("int\tat: 0x%x is 0x%08x\n", ip, *ip);

    printf("short\tat: 0x%x is 0x%04x\n", sp, *sp);
    printf("short\tat: 0x%x is 0x%04x\n", sp+1, *(sp+1));

    printf("char\tat: 0x%x is 0x%02x\n", cp, *cp);
    printf("char\tat: 0x%x is 0x%02x\n", cp+1, *(cp+1));
    printf("char\tat: 0x%x is 0x%02x\n", cp+2, *(cp+2));
    printf("char\tat: 0x%x is 0x%02x\n", cp+3, *(cp+3));

    return 0;
}
{% endhighlight %}

输出为：

```
int	at: 0x5715e8a8 is 0x0a0b0c0d
short	at: 0x5715e8a8 is 0x0c0d
short	at: 0x5715e8aa is 0x0a0b
char	at: 0x5715e8a8 is 0x0d
char	at: 0x5715e8a9 is 0x0c
char	at: 0x5715e8aa is 0x0b
char	at: 0x5715e8ab is 0x0a
```

