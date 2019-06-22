# 第一章 导航栏和标题栏界面

我们前面几章已经将小黄书的后台基础框架给搭建好了。后台的小黄书相关的业务逻辑，会在往后根据客户端的业务需求来进行实现。

今天起我们会开始小黄书小程序的实现。

我们先看下小红书应用的主界面。

![小红书主界面.jpg](http://upload-images.jianshu.io/upload_images/264714-58bf649c37856562.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这一篇文章中我们主要是要搞定以下界面的UI呈现：

- 将最下面的导航栏的界面呈现
- 最上面的标题栏的界面呈现

这里我们假设您已经做好以下准备，如果没有的话，请自行百度：

- 已经安装微信web开发者工具： 我们可以在该工具上进行小程序开发和调试，所以对我们来说它更像是个IDE。但，作为IDE来说，它还很不完善，代码编辑起来也很麻烦，所以我建议用Webstorm来做代码开发，但是用微信开发者工具来做调试。
-  已安装webstorm：我们可以在微信开发者工具中打开项目来进行调试，但是在webstorm中对代码进行开发和编辑。微信开发者工具会监控代码的改动，一旦我们在webstorm中进行代码的修改，保存后小程序将自动显示修改后的内容。
- 已经注册小程序：我们需要根据小程序的appid来发布和在真实机器的微信上运行我们的小程序。

# 1. 导航栏界面实现
---

微信小程序的开发简易教程请查看官网：
https://mp.weixin.qq.com/debug/wxadoc/dev/

看完后我们对小程序的开发流程，以及代码文件的功能和应该有个大概的了解。

## 1.1. 小程序文件结构和功能简介

每一个[小程序页面](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html)是由同路径下同名的四个不同后缀文件的组成，比如最上层的四个全局文件:

- .js后缀的文件是脚本文件：比如在最上层的app.js中，我们可以在这个文件中监听并处理小程序的生命周期函数、声明全局变量、**实现页面的业务逻辑**。

- .json后缀的文件是配置文件:  比如最上层的app.json 是对整个小程序的全局配置。我们可以在这个文件中配置小程序是由哪些页面组成，配置小程序的窗口背景色，配置导航条样式，配置默认标题。

- .wxss后缀的是样式表文件: 比如最上层的app.wxss 是整个小程序的公共样式表。我们可以在页面组件的 class 属性上直接使用 app.wxss 中声明的样式规则。

- .wxml后缀的文件是页面结构文件：最上层的全局配置中不需要这个文件。但是我们每个页面中至少有一个wxml文件，对应的是一个页面的html文件。


## 1.2. 生成小程序项目

根据官网的流程生成小黄书项目:
https://mp.weixin.qq.com/debug/wxadoc/dev/

微信web开发者工具会为我们生成基本的小程序文件，比如上面提及的：

- app.json等基本配置文件
- 同时还是生成两个基本的页面index和 logs。这些我们都不需要用到，所以可以忽略它们。

## 1.3. 图标准备

参考小红书的操作，导航栏总共有5个tab。其中每个tab都有对应的图标。同时，选中后的图标和没有选中的图标的颜色是不一样的。所以，我们这里需要为每一个标签准备两个形状一样但颜色不同的图标：

- 灰色：代表没有选中的默认颜色
- 黄色： 因为我们是小黄书，为了和小红书区别开来，**我们小黄书的颜色基调就是黄色**。

网上有很多提供免费图标的网站，我这里选择的是：
https://icons8.com/
因为这个网站可以让我选中一个图标后快速的修改不同的颜色，然后下载同一个图标不同颜色的版本。


![icons8.jpg](http://upload-images.jianshu.io/upload_images/264714-dbb1956b8a165bbf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

将需要的图标保存到小程序项目的res/icons/目录下面。

往下我们主要是修改app.json文件来配置我们的导航栏

# 1.4. 页面文件配置

首先，我们需要修改app.json中的pages选项:
> 接受一个数组，每一项都是字符串，来指定小程序由哪些页面组成。每一项代表对应页面的【路径+文件名】信息，**数组的第一项代表小程序的初始页面。小程序中新增/减少页面，都需要对 pages 数组进行修改。**

我们的5个页面配置如下:

``` json
  "pages": [
    "pages/home/home",
    "pages/search/search",
    "pages/shopping/shopping",
    "pages/messages/messages",
    "pages/about/about"
  ],
```

分别对应我们导航栏下面看到的5个页面的入口:

- 首页
- 发现
- 购买
- 消息
- 我

这里特别需要**注意**的是：数组的第一项代表小程序的初始页面。我们在启动小程序的时候会首先进入到这个页面中去。


# 1.5. 导航栏配置

导航栏主要是通过tabar选项来完成的。
> 如果我们的小程序是一个多 tab 应用（客户端窗口的底部或顶部有 tab 栏可以切换页面），那么我们可以通过 tabBar 配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。

>tabBar 是一个数组，只能配置最少2个、最多5个 tab，tab 按数组的顺序排序。

tabar可以放在顶部，也可以放在底部。参考小红书，我们会在底部呈现，且只有放在底部我们才能将上面下载的图标等显示出来。
>- 当设置 position 为 top 时，将不会显示 icon

配置如下:

``` json
  "tabBar": {
    "selectedColor": "Orange",
    "borderStyle": "grey",
    "backgroundColor": "white",
    "list": [
      {
        "pagePath": "pages/home/home",
        "iconPath": "res/icons/home_100px_default.png",
        "selectedIconPath": "res/icons/home_100px_selected.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/search/search",
        "iconPath": "res/icons/search_100px_default.png",
        "selectedIconPath": "res/icons/search_100px_selected.png",
        "text": "发现"
      },
      {
        "pagePath": "pages/shopping/shopping",
        "iconPath": "res/icons/cart_100px_default.png",
        "selectedIconPath": "res/icons/cart_100px_selected.png",
        "text": "购买"
      },
      {
        "pagePath": "pages/messages/messages",
        "iconPath": "res/icons/message_100px_default.png",
        "selectedIconPath": "res/icons/message_100px_selected.png",
        "text": "消息"
      },
      {
        "pagePath": "pages/about/about",
        "iconPath": "res/icons/avatar_100px_default.png",
        "selectedIconPath": "res/icons/avatar_100px_selected.png",
        "text": "我"
      }
    ]
  }
```

这里的各项配置的意义我们都可以在官网中很方便的找到：
https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html

这里需要提一下的是每个标签的iconPath和selectedIconPath两个配置，分别代表了上面说的:
- 没有选中时显示的图标: iconPath选项
- 选中时显示的图标: selectedIconPath选项

到此为止，我们的页面呈现将如下所示:

![导航栏界面呈现.jpg](http://upload-images.jianshu.io/upload_images/264714-7a047a8b5fd4b1b5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



# 2. 顶部导航栏配置
---

顶部导航栏的配置是通过修改windows选项来实现的。
> 用于设置小程序的状态栏、导航条、标题、窗口背景色。

实现如下:

``` son
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "orange",
    "navigationBarTitleText": "小黄书",
    "navigationBarTextStyle": "black"
  },
```

呈现效果如下：

![标题栏界面呈现效果.jpg](http://upload-images.jianshu.io/upload_images/264714-6b1d1e1723c87659.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 3. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuXiaoChengXu.git
- cd XiaoHuangShuXiaoChengXu/
- git checkout CH01

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
