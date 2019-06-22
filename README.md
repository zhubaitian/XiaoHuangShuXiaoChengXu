
# 第四章 主页面标签栏水平滑动和下拉弹出框

上一章我们实现了小黄书小程序的搜索栏的界面呈现。这一章我们将会参考小红书实现搜索栏下面的标签栏。

该标签栏存在的意义是，用户可以根据选择的标签来快速呈现相关的内容。该标签栏界面主要是两个功能模块。

一个是可以左右滑动的标签栏:

![搜索栏下的标签栏.jpg](http://upload-images.jianshu.io/upload_images/264714-13d86f71e8e5f920.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

另外一个功能模块就是，点击标题栏右边的箭头按钮，可以弹出和收起完整的标签弹出框:


![标签栏下拉弹出框.jpg](http://upload-images.jianshu.io/upload_images/264714-84f9f9b748215492.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 1. 标签栏布局
---

整个标签栏的布局实现跟我们上一章的搜索栏的布局的实现很类似，我们同样可以通过flex布局实现水平控件的排放。

所以布局的样式也很类似。我们可以：
- 在外层加一个view，用来实现标题栏的固定悬浮。这根搜索栏的固定悬浮是差不多的实现方式。
- 紧跟着在内层增加一个view，进行flex水平布局。这样，子控件scroll-view和下拉箭头按钮图标就能通过flex数值来控制所占长度的比例。

home.xml上的结构文件实现将会像下面这个样子:

``` wxml
<view class="bar-panel">
    <view class="tab-bar-wrapper" scroll="scrollEventHandler">
        <scroll-view class="scroll-bar" scroll-x  bindscroll="scrollEventHandler">
        </scroll-view>
        <view class="drop-down-menu" bindtap="filterTap">
        </view>
    </view>
</view>
```

## 1.1. 样式
外层实现固定悬浮标题栏的样式实现如下：

``` wxss
.bar-panel {
    position: fixed;
    top: 100rpx;
    width: 100%;
}
```
可以看到跟上一章的search-panel样式的实现差不多。

在将标签栏固定悬浮之后，我们就可以继续进行一层包装，将水平滑动标签栏和下拉弹出框按钮进行flex水平布局了。这就是tab-bar-wrapper样式需要做的事情:

``` wxss
.tab-bar-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
}
```

当父控件设置成flex水平布局之后，我们就可以将直接的两个子控件通过flex属性来设置所占长度比例了。

``` wxss
.tab-bar-wrapper .scroll-bar {
    white-space: nowrap;
    height: 120rpx;
    border-bottom: 1rpx solid #CCCCCC;
    flex: 8;
    overflow:hidden;
}

.tab-bar-wrapper .drop-down-menu {
    padding-left: 26rpx;
    margin-top: 32rpx;
    border-bottom: 1rpx solid #CCCCCC;
    flex: 1;
}
```

我们这里将水平滑动标签栏河下拉菜单在水平位置所占比例设置成8:1。 此外，我们还做了其他的一些调整：
- 比如我们通过border-bottom属性来设置控件底部的那条灰色的边框。
- 通过white-space的属性来禁止水平滑动标签栏的文本的换行，如果没有设置这一项，那么假如子控件中的一个标签的内容是“推荐”，那么“推”字和“荐”字就会各占一行，这不是我们想要的结果。
- 其他位置等的一些微调

如果我们此时将滑动栏的背景设置成红色，将下拉菜单的背景设置成绿色的话，当前的标签栏呈现将会如以下这样:


![标签栏布局.jpg](http://upload-images.jianshu.io/upload_images/264714-0bd7bc74195513b8.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 1.2. 滑动栏控件简述
---

微信提供了一个scroll-view的控件来让我们很方便的实现水平/垂直滚动。
https://mp.weixin.qq.com/debug/wxadoc/dev/component/scroll-view.html

常用的属性有以下几个：

| 属性名        | 类型           | 默认值  | 说明|
| ------------- |:-------------:| -----:|-----:|
| scroll-x     | Boolean | false |允许横向滚动
|scroll-y      | Boolean| false|允许纵向滚动|
|scroll-top| Number ||	设置竖向滚动条位置
|scroll-left| Number|| 设置横向滚动条位置
| bindscroll| EventHandle||滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}

我们可以看到我们上面的scroll-view控件就用到了scroll-x属性，声明这个滑动栏是水平滑动的。

# 2. 滑动标签栏
---

#2.1. 标签数据模拟

真实情况下，我们的标签数据应该是从数据库获得的。但是，我们现在还没有做到这一步，当前还是在界面设计的阶段，所以，我们先对这些数据进行模拟。

我们在home.js的data字段中，设置我们的标签关键字如下:

``` js
data: {
    keywords: [
      {
        id: 1,
        name: '推荐',
      },
      {
        id: 2,
        name: '男人',
      },
      {
        id: 3,
        name: '居家',
      },
      {
        id: 4,
        name: '时尚',
      },
      {
        id: 5,
        name: '美食',
      },
      {
        id: 6,
        name: '旅行',
      },
      {
        id: 7,
        name: '运动',
      },
      {
        id: 8,
        name: '护肤',
      },
      {
        id: 9,
        name: '母婴',
      },
      {
        id: 10,
        name: '女人',
      },
      {
        id: 11,
        name: '宠物',
      },
      {
        id: 12,
        name: '国防',
      },
      {
        id: 13,
        name: '宠物',
      },
      {
        id: 14,
        name: '台湾',
      }
    ],

  },
```

其中各个字段的意义如下：

- id：标签的唯一标志。我们需要用这个标志来和下面将要说到的下拉菜单中的标签保持一致。比如，点击了下拉菜单中的一个标签的时候，滑动标签栏中对应的标签就需要高亮选中显示。
- name：标签关键字的名称，我们将会在wxml中循环获取每一个关键字，并将其名称显示在滑动标签栏上。

## 2.2. block控制标签和wx:for循环显示标签名称

有了上面的模拟数据，我们就可以在scroll-view控件下面，循环的将每个标签的名称给显示出来。

``` wxml
 <scroll-view class="scroll-bar" scroll-x  bindscroll="scrollEventHandler">
            <block wx:for="{{keywords}}">
                <view id="{{item.id}}" class="tab-bar-item" bindtap="tabClick">{{item.name}}
                </view>
            </block>
        </scroll-view>
```

其中block关键字是一个代码控制标签，是为了后面的wx:for那一段代码儿存在的，不会存在真实的block控件给显示出来。当然，我们也可以将block换成view，但是，我们这里不希望再加多一层view，然后才显示我们的标签控件，所以我们采用了block这个代码控制标签。

wx-for是微信的列表渲染语法，详情可以查看：
https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html

> 在组件上使用wx:for控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件。

通过wx-for的列表渲染方式，我们就可以将每个关键字标签给显示出来。当然我们还是需要将每个标签的样式设置一下以便更好的呈现:

``` wxss
.tab-bar-item {
    margin-left: 26rpx;
    display: inline-block;
    padding: 13px 0;
}
```

因为父控件scroll-view的默认display方式是block而不是我们前面熟知的flex，所以我们这里的所有标签子控件都需要设置成inline-block。否则，标签将不能水平排列，而是会垂直排列。

到此的效果是，标签已经可以显示出来，并且可以左右滑动:

![显示标签.jpg](http://upload-images.jianshu.io/upload_images/264714-48f02a4ab9cf51d5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2.3. 选中标签ji动画效果呈现

我们现在虽然能把标签显示出来，但是选择了一个标签之后并没有看到界面上有什么显示。

为了更好的体验，我们需要增强一下选中后的显示效果：

- 选中之后标签高亮
- 标签下面提供一个游标
- 游标从原来位置移动到选中标签位置有动画效果

# 2.3.1. 选中标签高亮

首先，我们需要确定是哪个标签控件被选中了。所以需要在每个标签的bindTap事件中记录下当前控件的id。

``` js
  tabClick: function(e) {
    this.setData({
      activeId: e.currentTarget.id,
    });
  },
```

其中activeId我们默认设置成keywords列表的第一个控件的id，也就是1：

``` js
 data: {
    activeId: 1,
    keywords: [{
        id: 1,
        name: '推荐',
      },...],
},
```

tabClick事件处理函数的参数是个事件对象，这个对象成员currentTarget代表了我们点击的标签控件这个view。我们可以通过这个对象获得这个view的id和当前位置等属性。

> Object {id: "1", offsetLeft: 11, offsetTop: 0, dataset: Object}


同时我们要根据选中的标签控件的id来判断当前标签是否需要高亮显示：
 
``` js
<view id="{{item.id}}" class="tab-bar-item {{activeId == item.id ? 'bar-item-active' : ''}}" bindtap="tabClick">{{item.name}}
```

![标签高亮.jpg](http://upload-images.jianshu.io/upload_images/264714-350769090092958c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 2.3.2. 滑动游标

我们先看代码的实现。home.wxml中我们在scroll-view下增加一个view控件，代表我们的滑动游标:

``` wxml
        <scroll-view class="scroll-bar" scroll-x  bindscroll="scrollEventHandler">
            <block wx:for-items="{{keywords}}">
                <view id="{{item.id}}" class="tab-bar-item {{activeId == item.id ? 'bar-item-active' : ''}}" bindtap="tabClick">{{item.name}}
                </view>
            </block>
            <view class="bar-slider" style="transform: translateX({{sliderOffset}}px);"></view>
        </scroll-view>
```

将其样式设置成: 
``` wxss
.bar-slider {
    width: 70rpx;
    height: 8rpx;
    background-color: orange;
    transition: transform .3s;
}
```

背景颜色设置成我们小黄书的基调颜色橙黄色，并指定一个适当的宽度和高度。

这里关键的是滑动游标控件的style中的transform属性和样式表中的stransition的配置。

- **transform**：该属性主要用来实现控件的拉伸，压缩，旋转，偏移等。比如我们这里的游标在选中某个标签时平移到指定位置，就是通过transform的translateX方法来实现的。该方法需要提供一个X轴坐标参数。

- **transition**： transition属性用来对标签的变化过程进行设置。对我们这里来说，最重要的就是延迟参数。也就是有标从原来位置移动到目标标签位置所需要的时常，我们这里设置成0.3秒。注意，如果没有设置这个选项的话，就算上面的transform的translateX方法设置好了，也体现不出动画效果，点击一个标签后，游标就会立刻在标签下面显示出来。

最后我们需要在点击一个标签控件时设置translateX的参数，也就是上面的sliderOffset，这样我们游标才能根据实际点击的情况进行移动。 这个责任同样落入了tabClick这个事件handler里面:

``` js
  tabClick: function(e) {
    this.setData({
      activeId: e.currentTarget.id,
      sliderOffset: e.currentTarget.offsetLeft,
    });
  },
```

到此为止，游标的的效果将会如下：

![标签游标.jpg](http://upload-images.jianshu.io/upload_images/264714-08b351d27cbef5cc.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 3. 下拉菜单
---

## 3.1. wx:if条件渲染和下拉菜单图标toggle

在滑动标签栏的右边，我们需要显示下拉菜单的图标。且这个图标有两种状态：

- 收起状态：默认状态，代表下拉菜单没有展开。用往下的箭头表示。
- 展开状态： 当下拉菜单打开时，图标将呈现展开状态。用网上箭头表示。

home.wxml代码如下：

``` wxml
        <view class="drop-down-menu" bindtap="filterTap">
            <image wx:if="{{isCollapse}}" src="/res/icons/arrow_collapse.png"></image>
            <image wx:else src="/res/icons/arrow_expand.png"></image>
        </view>
```

其中isCollapse默认是true，代表第一次进入页面时菜单是处于收起状态:

``` js
data: {
    activeId: 1,
    sliderOffset:0,
    isCollapse: true,
    keywords: [...]
    },
```

当点击图标的时候，会触发父控件的tap事件，这时我们可以在该事件的handler中设置isCollapse状态:

``` js
  filterTap: function(e) {
    let self = this;
    if (self.data.isCollapse === true) {
      self.setData({
        isCollapse: false,
      });
    }else {
      self.setData({
        isCollapse: true,
      });
    }
  }
```

在以上代码中，我们用 wx:if="{{condition}}" 来判断是否需要渲染该代码块。由此来实现收起和展开的下拉菜单图标的toggle。

## 3.2. 下拉菜单展示和定制事件参数

往下是对下拉菜单的实现。wxml的结构跟标签栏有些类似：

``` wxml
<view class="filter-panel" hidden="{{isCollapse}}">
            <view class="filter-wrapper">
                <text wx:for="{{keywords}}" wx:key="" data-id="{{item.id}}" data-index="0" data-txt="{{item.name}}" bindtap="filter">{{item.name}}</text>
            </view>
        </view>
```

先是通过一个上层控件来实现下拉菜单的固定浮动：

``` wxss
.filter-panel {
    position: fixed;
    top:215rpx;
    box-shadow: 0 5px 5px rgba(0,0,0,.15);
    width: 100%;
    left: 0;
}
```
通过设置top来将顶层开始位置设置在大概是标题栏的底部边框位置。同时通过box-shadow来实现下拉菜单底部的阴影效果。

同时，上层控件通过hidden属性，来根据下拉菜单的图标是收起还是展开来隐藏或显示下拉菜单。

然后下一层控件中我们习惯性的再加多一层wrapper来进行更细微的一些样式控制。其实这些样式完全可以合并到上层控件的样式中。只是我们为了将上层控件用做固定浮动的指责更清晰的分离开来，所以我们还是再加多了这一层。其样式如下

```
.filter-wrapper {
    display: block;
    overflow: hidden;
    z-index: 1;
    background: #fff;
    padding-bottom: 26rpx;
    border-bottom: solid 1px #eee;
    text-align: center;
}
```

这里主要就是一些显示位置的微调，就不做过多的解析了。

最关键的是最后那个循环获取标签关键字并显示出来的代码:

``` html
<text wx:for="{{keywords}}" wx:key="" data-id="{{item.id}}" data-txt="{{item.name}}" bindtap="filter">{{item.name}}</text>

```

这里和上面的标签栏循环获取关键字的做法稍微不同的是，我们为每一个text控件增加data-id和data-txt属性，且它们的内容分别对应keywords标签中每个标签的id和name的内容。

当有了这些data-开始的属性，我们在点击这个控件的时候，这些属性就会作为参数的一部分传给所触发的事件handler处理函数。我们可以在事件处理函数filter中把参数打印出来：

``` js
  filter: function(e) {
    console.log('e:',e);
    }
```
点击某个标签之后，从输出中我们可以看到事件对象参数中的currentTarget.dataset下面包含了上面设置的data-id和data-txt的参数，只是名称少了前面的data-前缀而已：

![这里写图片描述](http://img.blog.csdn.net/20170606232117156?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvemh1YmFpdGlhbg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 3.3. 同步高亮滑动标签栏和下拉菜单选中标签

这个实现起来也比较容易，可以参考上面的标签栏在选中标签后高亮显示的做法：加入一个条件判断来决定在选中标签中应用高亮显示的样式：

``` html
<text class="{{activeId==item.id?'active':''}}" wx:for="{{keywords}}" wx:key="" data-id="{{item.id}}" data-txt="{{item.name}}" bindtap="filter">{{item.name}}</text>

```

在选择下拉菜单的标签后触发的事件处理函数filter中，设置activeId的值为我们上面传进去的关键字的id:

``` js
  filter: function(e) {
    this.setData({
      activeId: e.currentTarget.dataset.id,
    });
  }
```
同时增加选中样式如下:

``` css
.filter-wrapper .active{
    color:orange;
    border-color:orange;
    font-weight: bold;
}
```

最终我们选择一个标签时就会高亮显示下拉菜单中的选中标签，同时，与activeId相对应的关键字控件在滑动标签栏也会呈选中状态。因为，从前面的代码可以看到，它也是通过activeId的值来判断当前控件是否应该高亮显示的。

![这里写图片描述](http://img.blog.csdn.net/20170606233710977?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvemh1YmFpdGlhbg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 3.4. 选中标签后收起下拉菜单

到现在位置，我们的下拉菜单一旦打开后，只要不继续点击下拉菜单的收起图标，无论我们选择哪一个标签，它都还是一直处于展开状态的。

那么我们实际上需要做到的是，在选择了一个标签之后，下拉菜单自动收起。

根据上面的实现基础，我们只需要在filter事件处理函数中，将isCollapse属性设置成true就好了。

``` js
  filter: function(e) {
    console.log('e:',e);
    this.setData({
      activeId: e.currentTarget.dataset.id,
      isCollapse: true,
    });
  }
```

## 3.5. 同步滑动标签栏游标

在上一个图中，我们可以看到，现在选择一个此前没有选中的标签的时候，滑动标签栏的游标并没有变动。

这时如果我们能在选中下拉菜单中的一个标签的时候，设置一个正确的slideOffset的X坐标，这个问题就能perfect的解决掉了。

但问题是这里我不知道怎么去获取到在滑动标签栏中对应的标签的坐标位置。所以这里就要求教大家了:

> 求教：这里怎样才能正确的设置slideOffset？好让选中下拉菜单的标签后，游标能够正确的以动画方式滑动到对应的滑动标签栏的标签下方？

我暂时想到的一个蹩脚的workaround就是，
在用户点击下拉菜单中的标签后，隐藏掉游标控件，同时将对应的滑动标签栏中的控件的bottom-border设置成跟游标一样的样式
在用户点击滑动标签栏的一个标签的时候，再将该控件的bottom-border样式关掉，从新把游标控件显示出来。

这样做的弊端就是，当选择下拉菜单中的标签的时候，游标并没有动画的移动效果，而是一下子就从原来的位置消失，然后立刻就在选中的标签下方显示出来。

要实现这个效果，我们首先需要定义一个布尔变量来指示什么时候应该隐藏和显示游标。

``` js
data: {
    …
    hideSlider: false,
    …
}
```

默认的话，我们的游标不应该隐藏。但是，当我们选择下拉菜单的一个标签的时候，我们需要隐藏起来。所以我们需要在对应的事件处理函数中进行设置:

``` js

  filter: function(e) {
    this.setData({
      activeId: e.currentTarget.dataset.id,
      isCollapse: true,
      hideSlider: true,
    });
  }

```

同时，根据上面的描述，我们在用户点击滑动栏的标签的时候，我们要把游标给显示出来。所以在对应的事件处理函数中应该将hideSlider设置成false:

``` js
 tabClick: function(e) {
   this.setData({
      activeId: e.currentTarget.id,
      sliderOffset: e.currentTarget.offsetLeft,
      hideSlider: false,
    });
  },
```

而且，我们的游标控件需要增加设置以根据条件进行隐藏:

``` html
<view hidden="{{hideSlider}}" class="bar-slider" style="transform: translateX({{sliderOffset}}px);"></view>

```

同时，滑动标签栏的控件样式应该根据不同的条件进行border-bottom样式的显示和隐藏：

``` html
<block wx:for-items="{{keywords}}">
      <view id="{{item.id}}" class="tab-bar-item {{activeId == item.id ? 'bar-item-active' : ''}} {{(activeId == item.id && hideSlider)? 'bar-item-bottom' : ''}}"  bindtap="tabClick">{{item.name}}
      </view>
</block>
```

activeId == item.id和hideSlider同时为true的情况仅仅会在用户选择了下拉菜单的一个标签的时候，也就是说，只有当用户点击了下拉菜单的标签的时候，控件的border-bottom样式才会改变成类似游标的样子。

``` css
.tab-bar-item.bar-item-bottom {
    border-bottom: 3px solid darkorange;
}
```

最终效果图如下所示:


![下拉菜单最终效果.jpeg](http://upload-images.jianshu.io/upload_images/264714-b22ae8bfd714414a.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 4. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuXiaoChengXu.git
- cd XiaoHuangShuXiaoChengXu/
- git checkout CH03

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
