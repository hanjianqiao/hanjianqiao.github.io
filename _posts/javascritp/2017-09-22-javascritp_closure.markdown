---
layout: post
title:  "Javascript closure"
date:   2017-09-22 23:37:15 +0800
categories: javascript
---

* content
{:toc}

学习一下Javascript语言的闭包




# Closure（闭包）
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
现在，您了解闭包是如何工作的，我们终于可以坚持下去了。

以下是makeCounter示例一步一步分析，以确保了解所有内容。请注意[[Environment]]我们尚未深究。

1、脚本刚刚开始，只有全局LE：

![Lexical Environment][lexical environment 6]

在起始时刻只有makeCounter函数，因为它是一个函数声明。它还没有运行

所有函数“诞生时”都有一个隐藏[[Environment]]属性并且指向创建者。我们还没有深究它，但从技术上讲，这个函数知道它在哪里被创建的。

在这里，makeCounter是在全局LE中创建的，所以[[Environment]]保持引用它。

换句话说，一个函数有“印记”，记录其被创建所处的LE。[[Environment]]包含这个“印记”。

2、然后代码运行，makeCounter()执行调用。这是执行makeCounter()里面第一行的时刻的图片：

![Lexical Environment][lexical environment 7]

在调用时，makeCounter()创建了词汇环境，以保存其变量和参数。

作为LE，它存储两部分：

1、记录局部变量的LE。在现在的情况下count是唯一的局部变量（当执行let count时）。

2、外部LE引用，在函数的[[Environment]]里设置。这里makeCounter的[[Environment]]引用全局LE。

所以现在我们有两个LE：第一个是全局的，第二个是当前makeCounter的并外部引用全局LE。

3、在执行期间makeCounter()，创建一个小的嵌套函数。

使用函数声明或函数表达式创建函数无关紧要。所有函数的[[Environment]]都引用它们所在的LE。所以新的小的嵌套函数也得到它。

对于我们新的嵌套函数，它的[[Environment]]值是当前makeCounter()的LE：

![Lexical Environment][lexical environment 8]

请注意，在此步骤中，内部函数已创建，但尚未调用。内部的代码function() { return count++; }没有运行，我们将返回它。

4、随着执行继续，调用makeCounter()结束，并将结果（小嵌套函数）赋值给全局变量counter：

![Lexical Environment][lexical environment 9]

该函数只有一行：return count++，当我们调用它将被执行。

5、当counter()被调用时，为其创建一个“空”LE。它本身没有局部变量。但counter的[[Environment]]被用作它的外部引用，所以它可以访问makeCounter()的变量：

![Lexical Environment][lexical environment 10]

现在，如果它访问变量，它首先搜索自己的LE（空），然后搜索前一个makeCounter()调用的LE，然后是全局的。

在最近的外部LE中寻找count，它会在makeCounter的LE中找到。

请注意内存管理在这里工作。当makeCounter()调用结束后，一段时间内，它的LE被保留在内存中，因为有一个嵌套函数的[[Environment]]引用它。

一般来说，LE对象只要存在可以使用它的函数就可以生存。

6、调用counter()不仅返回值count，还可以增加它的值。请注意，修改已完成“到位”。count在被发现的环境中正确地修改了该值。

![Lexical Environment][lexical environment 11]

所以我们回到上一步，唯一的改变 - 新的count值。

7、下一次counter()调用也是一样的。

本章开头的第二块砖的答案现在应该是显而易见的。

work()通过外部LE获取name：

![Lexical Environment][lexical environment 12]

所以结果就是"Pete"。

......但是，如果在makeWorker()中没有let name，那么搜索会到外面去，并采用全局变量，那就是"John"。

闭包：
有一个通用的编程术语“闭包”，开发人员通常应该知道。

一个闭包是，记住它的外部变量，可以访问它们的函数。在某些语言中，这是不可能的，或者应该以特殊的方式写成，以使其发生。但是如上所述，在JavaScript中，所有函数都是自然闭包（只有一个排除，在“new”语法中被覆盖）。

也就是说：它们会用[[Environment]]属性自动记住创建的位置，并且所有这些都可以访问外部变量。

在接受采访时，前端开发人员提出了一个关于“什么是闭包”的问题，一个有效的答案将是，JavaScript中所有函数都是闭包，也可提及更多技术细节关于[[Environment]]属性以及LE如何工作。

## 代码块和循环，IIFE
上面的例子集中在函数上。但LE也存在于代码块{...}中。

它们是在代码块运行时创建的，并且包含块局部变量。这里有几个例子。

### if
在下面的示例中，当执行进入if块时，将为其创建新的“if-only” LE：

![Lexical Environment][lexical environment 13]

新的LE获得闭包的外部引用，所以phrase可以找到。但是内部声明的所有变量和函数表达式都存在于if的LE中，不能从外部访问。

例如，在if完成后，alert下面将不能访问user，因此错误。

### for，while
对于一个循环，每个运行都有一个单独的LE。如果变量被声明for，那么它也是该LE的局部变量：

{% highlight javascript %}
for(let i = 0; i < 10; i++) {
  // Each loop has its own Lexical Environment
  // {i: value}
}

alert(i); // Error, no such variable
{% endhighlight %}

这实际上是一个例外，因为let i看起来在{...}之外。但事实上，每个循环的运行都有自己的LE包含当前i的值。

循环后，i不可见。

### 代码块
我们还可以使用“裸”代码块{…}将变量隔离为“局部范围”。

例如，在Web浏览器中，所有脚本共享相同的全局区域。因此，如果我们在一个脚本中创建一个全局变量，它将变得可供其他人使用。但是，如果两个脚本使用相同的变量名称并相互覆盖，则会成为冲突的根源。

如果变量名是一个广泛的词，那么脚本作者就不会相互察觉。

如果我们想回避，我们可以使用代码块来隔离整个脚本或其中的一个区域：

{% highlight javascript %}
{
  // do some job with local variables that should not be seen outside

  let message = "Hello";

  alert(message); // Hello
}

alert(message); // Error: message is not defined
{% endhighlight %}

块之外的代码（或另一个脚本中的代码）不会看到变量，因为代码块具有自己的词汇环境。

### IIFE
在旧的脚本中，可以找到用于此目的的所谓的“立即调用的函数表达式”（缩写为IIFE）。

他们看起来像这样：

{% highlight javascript %}
(function() {

  let message = "Hello";

  alert(message); // Hello

})();
{% endhighlight %}

这里创建一个函数表达式并立即调用。所以代码现在执行，并有自己的私有变量。

函数表达式用括号括起来(function {...})，因为当JavaScript在解析到"function"在时，它将其解释为函数声明的开始。但是函数声明必须有一个名称，所以会出现一个错误：

{% highlight javascript %}
// Error: Unexpected token (
function() { // <-- JavaScript cannot find function name, meets ( and gives error

  let message = "Hello";

  alert(message); // Hello

}();
{% endhighlight %}

我们可以说“好吧，让它成为功能声明，让我们添加一个名字”，但它不会奏效。JavaScript不允许立即调用函数声明：

{% highlight javascript %}
// syntax error because of brackets below
function go() {

}(); // <-- can't call Function Declaration immediately
{% endhighlight %}

因此，需要括号才能表明，该函数是在另一个表达式的上下文中创建的，因此它是一个Function Expression。不需要名字，可以立即调用。

还有其他方式告诉JavaScript我们的函数是函数表达式：

{% highlight javascript %}
// Ways to create IIFE

(function() {
  alert("Brackets around the function");
})();

(function() {
  alert("Brackets around the whole thing");
}());

!function() {
  alert("Bitwise NOT operator starts the expression");
}();

+function() {
  alert("Unary plus starts the expression");
}();
{% endhighlight %}

在上面的所有情况下，我们声明函数表达式并立即运行。

### 垃圾回收
我们一直在讨论的LE对象是与常规值相同的内存管理规则。

* 通常函数运行后，LE被清理。例如：

{% highlight javascript %}
function f() {
  let value1 = 123;
  let value2 = 456;
}

f();
{% endhighlight %}
这里的两个值在技术上是LE的属性。但是，在f()完成LE变得无法访问之后，它就从内存中删除。

* ...但是如果有一个嵌套函数在结束之后仍然可以访问f，那么它的[[Environment]]引用也保持外部词汇环境的存在：
{% highlight javascript %}
function f() {
  let value = 123;

  function g() { alert(value); }

  return g;
}

let g = f(); // g is reachable, and keeps the outer lexical environment in memory
{% endhighlight %}

* 请注意，如果f()被多次调用，并且生成的函数被保存，则相应的LE对象也将保留在内存中。所有3个在下面的代码中：
{% highlight javascript %}
function f() {
  let value = Math.random();

  return function() { alert(value); };
}

// 3 functions in array, every of them links to Lexical Environment
// from the corresponding f() run
//         LE   LE   LE
let arr = [f(), f(), f()];
{% endhighlight %}

* LE对象在无法访问时销毁。也就是说：当没有引用它的嵌套函数时。在下面的代码中，在g变得无法访问之后，value也从内存中清除;
{% highlight javascript %}
function f() {
  let value = 123;

  function g() { alert(value); }

  return g;
}

let g = f(); // while g is alive
// there corresponding Lexical Environment lives

g = null; // ...and now the memory is cleaned up
{% endhighlight %}

### 现实优化
正如我们所看到的，在理论上，当函数存在时，所有外部变量也被保留。

但实际上，JavaScript引擎尝试优化。他们分析变量使用情况，如果很容易看到外部变量不被使用 - 它被删除。

V8（Chrome，Opera）中的一个重要副作用就是调试时变量不可用。

尝试使用Chrome中的开放式开发工具运行下面的示例。

当它暂停时，在控制台输入alert(value)。
{% highlight javascript %}
function f() {
  let value = Math.random();

  function g() {
    debugger; // in console: type alert( value ); No such variable!
  }

  return g;
}

let g = f();
g();
{% endhighlight %}
你可以看到 - 没有这样的变量！理论上应该是可以访问的，但引擎优化了它。

这可能导致有趣的（如果不是这么耗时的）调试问题。其中一个 - 我们可以看到一个相同命名的外部变量，而不是预期的外部变量：
{% highlight javascript %}
let value = "Surprise!";

function f() {
  let value = "the closest value";

  function g() {
    debugger; // in console: type alert( value ); Surprise!
  }

  return g;
}

let g = f();
g();
{% endhighlight %}

```
提示！
V8的这个功能很有用。如果您正在使用Chrome / Opera进行调试，迟早会遇到它。

这不是调试器的错误，而是V8的一个特殊功能。也许会有一段时间改变。您总是可以通过在此页面上运行示例来检查它。
```

Check out the [Javascript Closure].

[Javascript Closure]: https://javascript.info/closure
[lexical environment 0]: https://javascript.info/article/closure/lexical-environment-global@2x.png
[lexical environment 1]: https://javascript.info/article/closure/lexical-environment-global-2@2x.png
[lexical environment 2]: https://javascript.info/article/closure/lexical-environment-global-3@2x.png
[lexical environment 3]: https://javascript.info/article/closure/lexical-environment-simple@2x.png
[lexical environment 4]: https://javascript.info/article/closure/lexical-environment-simple-lookup@2x.png
[lexical environment 5]: https://javascript.info/article/closure/lexical-search-order@2x.png
[lexical environment 6]: https://javascript.info/article/closure/lexenv-nested-makecounter-1@2x.png
[lexical environment 7]: https://javascript.info/article/closure/lexenv-nested-makecounter-2@2x.png
[lexical environment 8]: https://javascript.info/article/closure/lexenv-nested-makecounter-3@2x.png
[lexical environment 9]: https://javascript.info/article/closure/lexenv-nested-makecounter-4@2x.png
[lexical environment 10]: https://javascript.info/article/closure/lexenv-nested-makecounter-5@2x.png
[lexical environment 11]: https://javascript.info/article/closure/lexenv-nested-makecounter-6@2x.png
[lexical environment 12]: https://javascript.info/article/closure/lexenv-nested-work@2x.png
[lexical environment 13]: https://javascript.info/article/closure/lexenv-if@2x.png

