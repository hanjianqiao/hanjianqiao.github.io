---
layout: post
title:  "Javascript closure"
date:   2017-09-22 23:37:15 +0800
categories: javascript
---
# Closure
Javascript是面向函数的语言，其本身非常灵活。函数创建以后，可以复制给变量或者作为参数传递给另一个函数，并在其他地方被调用。通常，一个函数可以访问函数外部的变量。而且这种访问很常见。但是，如果外部变量被改变，函数获得的是变量的初始值还是变量的最新值？另外，当函数被传递到另外一个地方并被调用，它是否还能访问之前的外部变量？下面我们讨论Javascript中的例子。（本文在'use strict;'条件下）

## 投石问路
首先我们提出两个问题引出对内部机制由浅入深的分析。
1、函数sayHi访问外部变量name，下面让我们看一下变量的值变化：

{% highlight javascript %}
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); // what will it show: "John" or "Pete"?
{% endhighlight %}

问题：sayHi函数使用的是变量最新的值吗？

2、函数makeWoker范围一个新的函数。返回的新函数可以在其他地方被调用。那么，当该函数被调用的时候，它是在创建的上下文访问变量，还是在被调用的上下文访问变量？

{% highlight javascript %}
function makeWorker() {
  let name = "Pete";

  return function() {
    alert(name);
  };
}

let name = "John";

// create a function
let work = makeWorker();

// call it
work(); // what will it show? "Pete" (name where created) or "John" (name where called)?
{% endhighlight %}

## 词法上下文
探究函数与变量的问题，需要先明确什么是“变量”，或者说“变量的机制”是什么。
在Javascript中，运行中的函数、代码块和脚本作为整体拥有一个对应的对象：Lexical Environment，以下简写为LE。
Lexical Environment由两部分组成：

1、Environment Record：具有所有当前范围内变量作为其属性的对象（以及某些其他信息，如this的值），以下简写ER。

2、对外部lexical environment的引用，通常是紧接着的上级代码块（包围着当前代码的代码部分）。

因此，“变量”就是特别的内部对象（ER）的一个属性。“读写变量的值”即是“读写该对象的属性”。
例如，下面的代码中包含一个LE：

![Lexical Environment][lexical environment 0]

这是便是全局LE，与整个脚本相关联。对于浏览器，所有\<script\>标签共享相同的LE。

在上图中，矩形表示ER（变量存储），箭头表示外部引用。全局LE没有外部环境，所以就是null。

以下是let变量工作原理的更大图景：

![Lexical Environment][lexical environment 1]

右侧的矩形演示了执行期间全局LE如何变化：

1、脚本启动时，词法环境为空。

2、在let phrase出现的定义。现在它最初没有值，所以undefined存储。

3、phrase 被分配。

4、phrase 指新值。

一切看起来都很简单，对吧？

总结：

* 变量是与当前执行的块/函数/脚本相关联的特殊内部对象的属性。
* 使用变量实际上是使用该对象的属性。

## 函数声明
函数声明是特殊的。与let声明函数不同，当创建LE时函数代码被处理，而不是在执行到代码的时候。对于全局LE，这意味着脚本启动的时刻。

...这就是为什么我们可以在定义之前调用函数声明。

下面的代码举例，LE从一开始就不是空的。它包含say，因为say是一个函数声明。后来let声明得到phrase：

![Lexical Environment][lexical environment 2]

## 内外词汇环境
在调用say()的时候使用外部变量，所以让我们看看发生了什么细节。

首先，当一个函数运行时，会自动创建一个新的函数LE。这是所有函数的一般规则。该LE用于存储本地变量和调用的参数。

当执行到say("John")内部的LE图片，标有三角箭头的行：

![Lexical Environment][lexical environment 3]

在函数调用期间，我们有两个LE：内部函数（用于函数调用）和外部函数（全局函数）：

* 内部LE对应于当前的执行say。它有一个变量：name函数参数。我们调用say("John")，所以name的值是"John"。外部LE是全局LE。
* 内部LE会引用外部LE。

当代码想要访问变量时，它首先在内部LE中搜索，然后在外部LE中搜索，然后在更外部LE中搜索，直到最外部LE。

如果在任何地方找不到变量，那就是严格模式（'use strict';）下的错误。如果不是严格模式，对未定义变量的赋值创建一个新的全局变量，以便向后兼容。

我们来看看我们的例子中搜索如何进行：

* 当say内部的alert想要访问时name，它会立即在函数LE中找到它。
* 当它想要访问时phrase，那么没有phrase本地的，所以它遵循向外搜索引用并在全局LE找到它。

![Lexical Environment][lexical environment 4]

现在我们可以从本章开始就给出第一块砖的答案。

一个函数得到现在的外部变量，最近的值。

这是因为所描述的机制。旧的变量值不保存在任何地方。当一个函数想要它们时，它需要来自它自己或者外部词汇环境的当前值。

所以第一个问题的答案是 Pete：

{% highlight javascript %}
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete"; // (*)

sayHi(); // Pete
{% endhighlight %}

以上代码的执行流程：

1、全局LE有属性name: "John"。
2、在行(*)全局LE被改变了name: "Pete"。
3、当该函数say()被执行并且name从外部获取时。这是来自全局LE "Pete"。


```
一个函数 - 一个词汇环境
请注意，每次函数运行时都会创建一个新的功能词汇环境。

而且如果一个函数被多次调用，那么每个调用都将有自己的词汇环境，其特定的局部变量和参数非常适用。
```

```
词汇环境是一个规范对象
“词汇环境”是一个规范对象。我们无法在我们的代码中获取此对象，并直接操作它。JavaScript引擎还可以对其进行优化，丢弃未使用的变量来节省内存并执行其他内部技巧，但可见行为应如所述。
```

## 嵌套函数
一个函数在另一个函数内创建时被称为“嵌套”。

从技术上讲，这很容易实现。

我们可以使用它来组织代码，如下所示：

{% highlight javascript %}
function sayHiBye(firstName, lastName) {

  // helper nested function to use below
  function getFullName() {
    return firstName + " " + lastName;
  }

  alert( "Hello, " + getFullName() );
  alert( "Bye, " + getFullName() );

}
{% endhighlight %}
这里嵌套函数getFullName()是为了方便创建。它可以访问外部变量，因此可以返回全名。

更有趣的是，可以返回嵌套函数：作为新对象的属性（如果外部函数创建具有函数属性的对象）或嵌套函数自身。然后在别的地方使用。无论在哪里，它仍然保持访问相同的外部变量。

构造函数的一个例子（参见构造函数，运算符“new”一章）：

{% highlight javascript %}
// constructor function returns a new object
function User(name) {

  // the object method is created as a nested function
  this.sayHi = function() {
    alert(name);
  };
}

let user = new User("John");
user.sayHi(); // the method code has access to the outer "name"
{% endhighlight %}

返回函数的示例：

{% highlight javascript %}
function makeCounter() {
  let count = 0;

  return function() {
    return count++; // has access to the outer counter
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2
{% endhighlight %}

我们来看一下这个makeCounter例子。它创建“counter”函数，每次调用返回下一个数字。尽管是简单，该代码的稍微修改的变体具有实际用途，例如，作为伪随机数生成器等。所以这个例子不是很随意的。

counter内部如何工作？

当内部函数运行时，count++从内向外搜索变量。对于上面的示例，顺序将是：

![Lexical Environment][lexical environment 5]

1、嵌套函数的内部变量。

2、外部函数的变量。

3、...更外部直到全局变量。

在该示例count中，在步骤中找到2。当一个外部变量被修改时，它在被找到的位置被改变。所以count++找到外部变量，并在它所属的LE中增加它。就像我们执行力let count = 1。

这里有两个问题：

1、我们可以从不属于的代码makeCounter的地方重置counter吗？例如alert调用之后的地方。
2、如果我们makeCounter()多次调用——它返回很多counter函数。他们是独立的还是共享count？

尝试在阅读前回答他们。

…你做完了吗？

好的，我们一起去解答。

1、不可能。这counter是一个局部函数变量，我们无法从外部访问它。
2、对于每一次调用makeCounter()会创建新的LE，拥有独立的counter。所以counter函数是独立的。
这是演示：

{% highlight javascript %}
function makeCounter() {
  let count = 0;
  return function() {
    return count++;
  };
}

let counter1 = makeCounter();
let counter2 = makeCounter();

alert( counter1() ); // 0
alert( counter1() ); // 1

alert( counter2() ); // 0 (independant)
{% endhighlight %}

## 环境详解


![Lexical Environment][lexical environment 4]
{% highlight javascript %}

{% endhighlight %}


Check out the [Javascript Closure].

[Javascript Closure]: https://javascript.info/closure
[lexical environment 0]: https://javascript.info/article/closure/lexical-environment-global@2x.png
[lexical environment 1]: https://javascript.info/article/closure/lexical-environment-global-2@2x.png
[lexical environment 2]: https://javascript.info/article/closure/lexical-environment-global-3@2x.png
[lexical environment 3]: https://javascript.info/article/closure/lexical-environment-simple@2x.png
[lexical environment 4]: https://javascript.info/article/closure/lexical-environment-simple-lookup@2x.png
[lexical environment 5]: https://javascript.info/article/closure/lexical-search-order@2x.png
[lexical environment 6]: 
[lexical environment 7]: 
[lexical environment 8]: 
[lexical environment 9]: 
[lexical environment 10]: 
[lexical environment 11]: 
[lexical environment 12]: 
