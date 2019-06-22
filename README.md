# 第二章 主页面搜索栏和flex布局

上一章我们实现了小程序的导航栏和标题栏的呈现，今天我们会开始小黄书主页面的相关界面。

因为本人对css不是很熟悉，所以涉及到的知识点都会写得比较细，对于熟悉的朋友来说，也许会觉得比较冗余。所以大家酌情观看。


# 1. 搜索栏
---

经过上一章的实战，我们这个时候在pages/home页面已经生成了相应的几个文件:
- home.js
- home.json
- home.wxml
- home.wxss

我们将会在home.wxml中进行类似html页面结构的实现，在home.wxss中进行类似css样式的实现。因为我们现在还不会进行和服务器的交互，所以home.js中会实现的逻辑很少，主要是一些调试和mock的数据。

最终的效果如下:

![最终呈现.jpg](http://upload-images.jianshu.io/upload_images/264714-951fe501b346876a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 1.1. 置顶浮动

搜索栏有以下几个特点:
- 位于页面顶部
- 属于浮动控件，不会随着下面的内容的移动而移动。

我们主要会通过wxss样式来实现这几个特点。

我们先在home.wxml中加入一个搜索栏最上层的view，这个view相当于一个container。
``` ixml
<view class="search-panel">
</view>
```

这个view自身不会呈现任何内容，我们主要是通过它来将其子内容定位页面顶部并进行浮动。

所以该view对应的class样式search-panel的实现内容如下:

``` wxss
.search-panel {
    position: fixed;
    width: 100%;
    background-color: orange;
    top: 0;
}
```
通过这个顶层panel的样式设置，我们可以实现:
- 将position设置成fixed，实现这个面板以及其子内容，也就是搜索栏的浮动。不会随着下面的内容的上下滑动而滑动。
- 将top设置成0，将我们的搜索栏固定在页面的最上方。
- 将width实现成100%， 将顶层panel铺满整个宽度，这样我们的背景颜色才会在全部宽度上进行显示。同时我们的其他子控件才能更好的根据这个父控件的width进行调整设置。
- 将我们的搜索栏背景颜色设置成我们的基调颜色-橙黄色。

## 1.2. 横向flex布局搜索栏

固定好搜索栏的位置之后，我们可以开始布局搜索栏里面的内容。

搜索栏的内容分两层：
- 第一层是搜索框(包含搜索框前面的搜索图标)和摄像头图标，它们是横铺排列的。
- 第二层是搜索框里面的搜索图标和搜索输入框，也是横铺排列的。

对于这种布局，我们可以通过flex布局来很容易实现。

我们先在顶层panel下面增加多一个view:

``` ixml
<view class="search-panel">
    <view class="search-wrapper">
    </view>
</view>
```

上面的的panel这个view是为了让我们实现整个搜索框的固定悬浮，这里的这个wrapper是为了让其里面的搜索框和摄像头图标控件能够横向的排列显示。

``` wxss
.search-wrapper {
    padding: 10rpx 0rpx;
    display: flex;
    flex-direction: row;
    width: 100%;
}
```

这里关键就是display和flex-direction的设置。当我们将布局方式设置成flex，并且将flex-direction设置成row的时候，子控件就会横向的排列。如果将flex-direction设置成column，子控件就会纵向排列。

>注意这里flex的布局方式不会继承，只会对直接的子控件有效。

## 1.3. 通过设置flex数值控制子控件所占长度比例

小红书中搜索框和相机图片所占的宽度比例大概是8:1。我们可以通过设置flex布局下的子控件的flex样式来控制这个比例。

我们先增加两个view分别代表搜索框和照相机控件：

``` wxml
<view class="search-panel">
    <view class="search-wrapper">
        <view class="search-input-wrapper ">
        </view>
        <view class="search-upload-wrapper">
        </view>
    </view>
</view>
```

我们可以在对应的样式中，通过设置flex的大小来控制这两个子控件所占的长度比例:

``` wxss
.search-input-wrapper {
    flex: 8;
}
```

``` wxss
.search-upload-wrapper {
    flex: 1;
}
```

当然，除了所占长度比例之外，我们还需要为这两个控件增加其他样式。 

如上面说的，搜索框是由前面的一个搜索图标和输入框组成的，且，flex布局不会影响子控件之外的更深层次的布局，所以我们还需要在search-input-wrapper样式中标志它的这两个子控件也是flex横向布局的。同时，搜索框的边框应该是一个椭圆的角度，所以我们还要设置一下border-radius。以及，进行背景颜色等其他的参数调整：

``` wxss
.search-input-wrapper {
    flex: 8;
    padding: 10rpx;
    background-color: darkorange;
    border-radius: 20rpx;
    display: flex;
    flex-direction: row;
    margin-left: 80rpx;
}
```

而对search-upload-wrapper，我们也做一些微调:

``` wxss
.search-upload-wrapper {
    padding-left: 15rpx;
    padding-right: 15rpx;
    padding-top:5rpx;
    flex: 1;
}
```

## 1.4. 显示相机图标

修改home.wxml来在最右边显示相机控件:

``` wxml
<view class="search-panel">
    <view class="search-wrapper">
        <view class="search-input-wrapper ">
        </view>
        <view class="search-upload-wrapper">
            <image class="search-upload-img" src="/res/icons/camera_100px_default.png" bindtap="onCameraTap"></image>
        </view>
    </view>
</view>

```

其中src指定的图片我们此前已经下载并存储好。同时我们还绑定了图片的tab事件。因为我们现在还不会做逻辑处理，所以，我们先在home.js文件中打印一个信息就好了:

``` js
  onCameraTap: (e) => {
    console.log('onCameraTap:', e);
  }
```

同时我们对图标的大小等做些样式配置:

``` wxss
.search-upload-img {
    width: 60rpx;
    height: 60rpx;
    padding-top: 8rpx;
}
```

# 1.5. 输入框界面

输入框由一个搜索图标和一个输入框组成。

``` wxml
<view class="search-panel">
    <view class="search-wrapper">
        <view class="search-input-wrapper ">
            <image class="search-input-before" src="../../res/icons/search_100px_default.png"></image>
            <input bindinput="bindSearchInput" bindconfirm="search" class="search-input" placeholder="搜索笔记，商品和用户" value="{{input}}" confirm-type="search" />
        </view>
        <view class="search-upload-wrapper">
            <image class="search-upload-img" src="/res/icons/camera_100px_default.png" bindtap="onCameraTap"></image>
        </view>
    </view>
</view>
```

跟上面类似，我们这里同样是通过设置flex数值来控制这两个子控件的长度比例:

``` wxss
.search-input-before {
    flex: 1;
    height: 60rpx;
    width: 60rpx;
    padding-top: 8rpx;
}
.search-input {
    flex: 8;
    padding-top: 5rpx;
    padding-left: 5rpx;
}
```

对于输入框，我们绑定了几个事件:
- bindInput: 输入的时候触发
- bindConfirm: 输入完成按确定或者搜索键后触发

我们这里也不做进一步的逻辑处理，只简单的在事件触发后打印一些调试信息:

``` js

  bindSearchInput: (e) => {
    console.log('input with value:',e.detail.value);
  },

  search: (e) => {
    console.log('confirm with value:',e.detail.value);
  },
```

# 2. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuXiaoChengXu.git
- cd XiaoHuangShuXiaoChengXu/
- git checkout CH02

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
