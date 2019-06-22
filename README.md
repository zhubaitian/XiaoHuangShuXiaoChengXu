# 第四章 图片高度自适应及上拉无限加载及下拉更新

上一章我们实现了小黄书小程序标签栏的左右滑动和弹出框UI功能，今天我们会开始实现主页面中笔记的呈现。

主要的功能会囊括以下几个方面:

- 笔记的两列式布局： 一行只是显示两个笔记。且每个笔记的封面图片的高度进行自适应呈现。
- 笔记的下拉刷新： 下拉时，检查是否有新的笔记，并完成加载。同时在标题栏显示加载动画。
- 笔记的上拉无限加载：上拉时，获取更多的笔记，并进行加载。同时在下方显示加载动画。

# 1. 笔记呈现UI实现
---

## 1.1. 笔记Mock数据

因为我们现在还没有实现小程序服务器端的相关逻辑，所以我们依然需要像上一章的标签关键字一样，需要对笔记的数据源进行mock模拟。且因为mock的数据越来越多，所以这里我们将需要mock的数据抽取出来到一个独立的文件/config/mock.js里面。

``` js
/**
 * Created by KevinZhu from Lathander on 18/06/2017.
 */

module.exports = {
    home: {
        notes: [
            {
                id: 1,
                title: '第一篇笔记标题阿打发斯蒂芬王二娃的说法',
                description: '第一篇笔记摘要啊所发生的发是的发送到发斯蒂芬盛大发售的法师法师打发斯蒂芬adsfasdfsaewr俺的沙发是的发生法司法是的发送到发斯蒂芬玩儿玩儿 ',
                content: '第一篇笔记内容',
                tab: '推荐;男人;居家;时尚;美食;旅行;',
                like: 1,
                owner: {
                    nickname: '天地会珠海分舵sdfadfa是的发送到发',
                    avatar: 'http://tupian.enterdesk.com/2014/lxy/2014/12/01/5/1.jpg',
                },
                images: [
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496859897099&di=0d312e42c7ddc08ae1983bb64efe9c85&imgtype=0&src=http%3A%2F%2Fpic10.nipic.com%2F20100929%2F3803997_112226074530_2.jpg',
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496859935050&di=c60137dfd2ef89d18285e44404eb538e&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2014%2Fmxy%2F01%2F11%2F02%2F27.jpg'
                ]
            },
            {
                id: 2,
                title: '第2篇笔记标题dafasdfasfa速度发发发斯adf是的发送到发斯蒂芬阿斯顿发是的发送到发斯蒂芬大沙发斯蒂芬 蒂芬',
                description: '第2篇笔记摘要',
                content: '第2篇笔记内容',
                tab: '推荐;男人;居家;时尚;美食;旅行;',
                like: 2,
                owner: {
                    nickname: '张三',
                    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496859997941&di=86b161ee2822c469eb69e80117d53aab&imgtype=0&src=http%3A%2F%2Fwww.wfmqj.com%2Fimg%2Fbd21052360.jpg',
                },
                images: [
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163186&di=c6480fcb43cb97f873c0a9ddd0bcc933&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F14%2F27%2F45%2F71r58PICmDM_1024.jpg',
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163186&di=033b97bc8acdfab970f8f58563fa81ee&imgtype=0&src=http%3A%2F%2Fpic24.nipic.com%2F20121008%2F3822951_094451200000_2.jpg'
                ]
            },
            {
                id: 3,
                title: '第3篇笔记标题',
                description: '第3篇笔记摘要',
                content: '第3篇笔记内容',
                tab: '推荐;男人;居家;时尚;美食;旅行;',
                like: 4,
                owner: {
                    nickname: '李四',
                    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496859997941&di=18b1d47af39c034537bcf72a4687da87&imgtype=0&src=http%3A%2F%2Fwww.qqxoo.com%2Fuploads%2Fallimg%2F170524%2F1353405335-8.jpg',
                },
                images: [
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163185&di=068ca64b1142d468b9126cfa5425d38e&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2F2015%2Fa1%2F17%2Fd%2F205.jpg',
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163185&di=ca8f53e2ecfcbc1a926579e65a3fc7e7&imgtype=0&src=http%3A%2F%2Fpic11.nipic.com%2F20101214%2F213291_155243023914_2.jpg'
                ]
            },
            {
                id: 4,
                title: '第4篇笔记标题',
                description: '第4篇笔记摘要',
                content: '第4篇笔记内容',
                tab: '推荐;男人;居家;时尚;美食;旅行;',
                like: 5,
                owner: {
                    nickname: '王五',
                    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860093252&di=1a3adebc45ab9dc5a7cb1d85f287154f&imgtype=jpg&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D3491235583%2C1398059858%26fm%3D214%26gp%3D0.jpg',
                },
                images: [
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163185&di=6d6a64cb3ba31e0c818ac0a7d7d1bf0b&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F15%2F32%2F43x58PICgE2_1024.jpg',
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163185&di=a4c79e9baebefc0ce814603acb274d5f&imgtype=0&src=http%3A%2F%2Fpic2.ooopic.com%2F11%2F34%2F46%2F78b1OOOPIC4e.jpg'
                ]
            },
            {
                id: 5,
                title: '第5篇笔记标题',
                description: '第5篇笔记摘要',
                content: '第5篇笔记内容',
                tab: '推荐;男人;居家;时尚;美食;旅行;',
                like: 6,
                owner: {
                    nickname: '周六',
                    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860133578&di=388b24320abf6483920f32dfc25246e7&imgtype=jpg&src=http%3A%2F%2Fimg4.imgtn.bdimg.com%2Fit%2Fu%3D3751090459%2C1882564260%26fm%3D214%26gp%3D0.jpg',
                },
                images: [
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163185&di=2cb1fb731ba4ea5b694dde28ec9a533c&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fwallpaper%2F1308%2F17%2Fc6%2F24564406_1376704633091.jpg',
                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496860163184&di=7c510aaabaa0b872552c52a5caddde58&imgtype=0&src=http%3A%2F%2Fpic17.nipic.com%2F20111122%2F6759425_152002413138_2.jpg'
                ]
            },
        ],

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

    }
}
```

笔记的各个字段今后根据服务器实现的情况和今后功能的增加很有可能会进行增减或者修改。在mock的数据中定义的字段意义大概如下：

- **id**：笔记的唯一标识，全局唯一。
- **title**： 笔记的标题。将会显示在主页面的每个笔记中，且最多只会显示两行。
- **description**：笔记的简述。将会显示在主页面的每个笔记中，且最多只会显示三行。
- **content**： 笔记的内容。将会在今后要实现的笔记详情中显示
- **tab**： 笔记所属的标签。用于在用户点击上一章实现的标签时，对笔记进行过滤显示。
- **like**： 点击了喜欢该笔记的人数。
- **owner**： 该笔记的拥有者信息。包含了用户的昵称和头像。
- **images**： 该笔记的图片，至少需要有一张。第一张图片将会在主页面的笔记中作为封面进行呈现。

## 1.2. 页面加载时加载笔记

首先我们需要在data下面加入一个需要绑定到页面的笔记列表notes变量:

``` js
 data: {
    activeTabId: 1,
    tabBottomSliderOffset:0,
    isDropDownMenuCollapse: true,
    hideTabBottomSlider: false,
    keywords: mock.home.keywords,
    notes: [],
  },
```
并且在页面进行加载的时候，将mock的数据初始化data中的notes变量:

``` js
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadNotes();
  },
```

笔记的加载我们通过封装一个叫做loadNotes的方法来进行实现：

``` js
loadNotes: function() {
    const notes = mock.home.notes;
    const newNotes = this.data.notes.concat(notes);
    this.setData({
      notes: newNotes
    });
  },
```
当然，我们需要将mock数据文件给包含进来:

``` js
const mock = require('../../config/mock');
```
这样，我们就能在页面加载的时候将mock下面的的笔记给加载进来。这里需要注意的是loadNotes里面，我们并不是直接将mock中的笔记notes赋值给newNotes，而是用了concat，就是将mock中的笔记追加到原有的笔记列表里面。这主要是因为我们往下需要实现下拉刷新和上拉无限加载的功能。

每次下拉或者上拉，我们都会在已有笔记的基础上追加一组模拟笔记数据，然后设置到data中的notes，最后自动重新渲染UI。

当然，在加载页面时，因为data里面的notes还是为空，所以onLoad后只会有一组mock的笔记数据。

## 1.3. 笔记图片UI呈现

有了前两章比较细致的布局和样式的描述，我们就没有必要再次一行一行的对布局和样式设置进行讲解了。我们先看下整个日记大概的布局文件（当然，还是由简入繁，现在每个日记只是包含了一个图片）

``` html
<view class="content-container">
    <view class="content-wrapper">
        <block wx:for="{{notes}}" wx:key="">
            <view class="item_box">
                <navigator url="../note_detail/index?id={{item.id}}">
                    <image src="{{item.images[0]}}"/>
                </navigator>
            </view>
        </block>
    </view>
</view>

```

整个思路跟上两章的标签栏等的布局差不多。先用一个最外层的view来对我们整个笔记显示区域进行定位，让我们的显示从标题栏下方开始:

``` css
.content-container {
    margin-top:215rpx;
}
```
然后内层继续加一个view来作为wrapper封装层，来设置子控件中代表各个笔记的view的布局方式为flex布局:

``` css
.content-wrapper {
    display: flex;
    flex-wrap: wrap;
}
```
注意这里我们并没有特意指定flex-direction为row，因为:
> Flex布局默认沿主轴横向排列。

同时这里我们设置上flex-wrap为wrap，配合笔记控件的width设置，实现在排列到两个笔记的时候自动换行。

如上一章所描述的，block只是逻辑代码控制块，它只是为了让我们更好的控制循环的获取home.js中的data中设置的notes笔记列表，以进行显示操作，并不会占用我们真实的页面位置。

其中每个笔记的样式是这样设置的：

``` css
.item_box {
    width: 48%;
    margin: 0 1%;
}
```
主要是宽度的设置，每个笔记的宽度是屏幕的48%，结合上面的wrapper封装层的flex-wrap的设置，第三个笔记就会自动在第二行显示。也就是说，每行最多只会显示两篇笔记信息。这里的margin只是作为一个微调，让笔记之间有点间距。

笔记控件里面再封装了一个navigator，主要是为了在点击笔记的时候能重定向笔记的详情页面了，详情页面我们往后章节会实现。

最里层就是我们需要显示的笔记的第一张图片了。我们将其设置成宽度充满我们的整个笔记控件：

``` css
.item_box image{
    width: 100%;
    max-height: 380rp
}
```
但是高度我们没有办法通过css来控制，我们只能设置个最大高度。因为不同的图片有不同的size，在宽度压缩成只有屏幕的48%的时候，我们在css中，并不知道高度应该压缩成多少个像素。注意这里高度不能用百分比来控制，因为我们并不知道父控件的高度是多少，父控件恰恰是需要根据我们图片的高度来自动调整的。

至此，整个笔记的呈现将如下所示:

![笔记图片呈现.png](http://upload-images.jianshu.io/upload_images/264714-095e2cb705c99185.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 1.4. 图片高度自适应

虽然我们没有办法在css中直接控制图片的高度。但是我们可以通过逻辑代码来实现这一点。

参考网上的示例，具体思路是这样的：

- 首先在页面加载的时候获取到屏幕的宽度像素大小
- 根据屏幕的宽度乘以48%，获取到图片宽度在缩放后的像素
- 绑定图片加载事件binload
- 当图片加载时，会触发加载事件，传进来的事件参数会包含图片的原始宽度和高度的像素值。将上面的缩放后的图片宽度的实际像素值除以原始宽度，则得到缩放比率
- 将图片的原始高度乘以缩放比率，就能得到图片缩放后的高度应该是多少个像素。
- 然后我们在image控件中设置图片高度的style，值就直接设置成上面计算后的结果。这样图片的高度就能自适应了。

首先我们修改image控件的布局如下:

``` html
        <block wx:for="{{notes}}" wx:key="">
            <view class="item_box">
                <navigator url="../note_detail/index?id={{item.id}}">
                    <image style="height:{{item.imgHeight}}px" src="{{item.images[0]}}"  data-id="{{item.id}}" bindload="onImageLoad" />
                </navigator>
            </view>
        </block>
```
其中item.imgHeight就是我们上面描述的计算后的图片高度的像素值，这个像素值会设置到data的笔记变量notes中的对应笔记项中。这里我们同时会通过data-id来将当前加载的图片的id穿进去给bindload事件，这样bindload事件才知道计算后的图片告诉应该设置到哪个笔记项中。我们往下会看到这方面的代码。

跟着我们修改页面加载事件的代码，去获得屏幕的宽度，并由此计算出每个笔记的封面图片应该显示的宽度像素是多少。

``` js
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgWidth = ww * 0.48 ;
        this.setData({
          imgWidth: imgWidth
        });
        this.loadNotes();
     }
    })
  },
```
屏幕宽度像素是通过wx.getSystemInfo这个微信api给获取到的。按照我们上面的描述，我们笔记的封面图片的宽度呈现应该是48%的屏幕宽度。两者相乘就获得了图片实际呈现时的宽度像素。我们最后将这个值保存起来到data里面。

在binload的图片加载事件中，我们就可以根据上面的图片实际呈现的宽度像素和图片原始宽度和高度的比值，来计算出图片实际呈现的高度像素值了。

``` js
 onImageLoad: function (e) {
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    const notes = this.data.notes;
    for (let note of notes) {
      if (note.id == e.currentTarget.dataset.id) {
        note.imgHeight = imgHeight;
      }
    }
    this.setData({
      notes: notes
    });
  },
```
整个算法和我们这小节开始的时候的流程描述一样：
- 从图片加载事件中获取到图片的原始宽度和高度
- 从data中获取到我们上面在页面加载时计算出来的图片的实际呈现宽度像素值
- 将实际需要呈现的图片宽度除以原始宽度，得到缩放比率
- 将这个缩放比率乘以图片原始的高度比率，则得到图片缩放后的高度像素大小
- 根据我们传进来的笔记的id，找到data中的笔记列表中对应的笔记，然后将这个高度的像素设置到对应的笔记的imgHeight成员里面。这样我们上面的image控件就能根据这个成员来自动调整图片的高度了。

到此为止，页面的呈现效果如下:

![图片高度自适应.png](http://upload-images.jianshu.io/upload_images/264714-833baba351d6e26f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 1.5. 笔记信息和多行省略显示

上一节我们将笔记的图片给显示出来了。这一节我们需要将笔记的标题和摘要给显示出来，且这些信息都需要在navigator的可点击覆盖范围之内。也就是说，当用户点击图片或者笔记的标题和摘要区域时，都会尝试跳转到笔记的详细页面，虽然，我们现在还没有实现笔记的详细页。

这里碰到的问题是，如果笔记的长度过长的话，那么我们的显示就会很难看。所以我们要想办法将笔记的标题最大长度控制在两行，而笔记的摘要最多显示三行，且在超过时在后面用省略号显示。

上网查了一下，css3中的flex布局比较老点的写法-webkit-box能很好的完成这个功能。但是最新的flex反而没有支持上。所以我们先用老的写法来实现，并期望flex往后尽快支持上这些特性。

好的，我们先在navigator中加入标题和摘要控件:

``` html
                <navigator url="../note_detail/index?id={{item.id}}">
                    <image style="height:{{item.imgHeight}}px" src="{{item.images[0]}}"  data-id="{{item.id}}" bindload="onImageLoad" />
                    <view class="item_title">{{item.title}}</view>
                    <view class="item_digest">{{item.description}}</view>
                </navigator>
```
然后这里的重点就是css3的-webkit-box布局的实现了，标题和摘要的写法差不多:

``` css3
.item_box .item_title{
    font-weight: bold;
    margin-top:20rpx;
    margin-bottom:20rpx;

    overflow: hidden;
    display: -webkit-box;  /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp:2; /* 用来限制在一个块元素显示的文本的行数 */
    text-overflow:ellipsis; /* 可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 */

}

.item_box .item_digest{
    color: grey;
    margin-bottom: 20rpx;

    overflow: hidden;
    display: -webkit-box;  /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp:3; /* 用来限制在一个块元素显示的文本的行数 */
    text-overflow:ellipsis; /* 可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 */

}
```
代码中来自网络的注释已经很好的解析的这些关键代码的功能，我也就无需多言了，况且我也真说不出什么来。

最终的显示效果如下:

![笔记多行省略显示](http://upload-images.jianshu.io/upload_images/264714-94b1197e0efa4ffb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 1.6. 用户信息和点赞UI显示

用户的头像和点赞等信息是没有放到navigator里面的，因为我们希望用户可以点击头像或者点赞icon时可以导航到对应的页面，而不是进到笔记的详细信息里面去。

``` html
<view class="content-container">
    <view class="content-wrapper">
        <block wx:for="{{notes}}" wx:key="">
            <view class="item_box">
                <navigator url="../note_detail/index?id={{item.id}}">
                    <image style="height:{{item.imgHeight}}px" src="{{item.images[0]}}"  data-id="{{item.id}}" bindload="onImageLoad" />
                    <view class="item_title">{{item.title}}</view>
                    <view class="item_digest">{{item.description}}</view>
                </navigator>
                <view class="userinfo_wrapper">
                    <image class="userinfo-avatar" src="{{item.owner.avatar}}" background-size="cover"></image>
                    <view class="userinfo-nickname">{{item.owner.nickname}}</view>
                    <image class="like_image" src="/res/icons/heart_100px.png" background-size="cover"></image>
                    <view class="like_count">{{item.like}}</view>
                </view>
            </view>
        </block>
    </view>
</view>
```
参考小红书的显示，我们希望在一行内显示完所有用户信息和点赞信息。所以思路还是在上层用一个wrapper控件来应用上flex的样式并设置直系子控件进行横向排列。

``` css3
.item_box .userinfo_wrapper {
    margin: 10rpx;
    display: flex;
    flex-direction: row;
}
```

然后个子控件设置好各自的flex大小来占用对应的宽度。

``` css3
.item_box .userinfo-avatar {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    flex: 1;
}

.item_box .userinfo-nickname {
    margin-left: 10rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    flex: 6;
}

.item_box .like_image {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    flex: 1;
}

.item_box .like_count {
    color: #aaa;
    margin-left: 10rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    flex: 1;
}
```
其他的一些微调属性，除了头像和点赞icon怎么设置成圆形显示之外，其他我们都见过了。

头像和点赞icon是通过设置border-radius的属性来实现的。该属性设置的是控件的圆角边框，在图像控件的长宽相等的情况下，50%刚好让控件形成一个圆形。

最终的显示如下:

![用户信息及点赞](http://upload-images.jianshu.io/upload_images/264714-34ce39602883ef29.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#2. 下拉刷新
---
根据小程序的官方文档，我们可以通过onPullDownRefresh的监听事件来监听用户是否触发了下拉动作。
https://mp.weixin.qq.com/debug/wxadoc/dev/api/pulldown.html

当然，我们需要在全局配置文件app.json中启能这个功能。

``` json
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#FFA500",
    "navigationBarTitleText": "小黄书",
    "navigationBarTextStyle": "black",
    "enablePullDownRefresh": true
  },
```
启能之后，我们就可以在事件处理函数中通过mock模拟数据来模拟下拉刷新的动作了:

``` js
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.loadNotes();

    setTimeout( () =>{
      wx.hideNavigationBarLoading(); //在标题栏中显示加载
      wx.stopPullDownRefresh();
    }, 2000)
  }
```

一旦用户按住笔记部分进行下拉操作，代码就会

- 调用微信的api来在标题栏显示一个加载中的动画
- 加载最新的笔记到data的notes中。当然，如前面对加载函数的描述，loadNotes只是将模拟的笔记数据追加到原有笔记的后面。在今后的真实情况的实现中，我们需要从服务器中获取最新的笔记。
- 设置一个定时器，在2秒之后停掉标题栏中的加载动画的显示，并调用微信的stopPullDownRefresh动作来停止刷新。

这时下拉的标题栏效果如下:

![下拉刷新](http://upload-images.jianshu.io/upload_images/264714-580015c77f324a0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 3. 上拉无限加载
---

实现上拉无限加载，主要是要实现以下几个功能：

- 捕获用户的上拉事件
- 显示加载动画
- 加载更多笔记到页面data的notes笔记里面，让绑定笔记数据的home页面自动渲染所有笔记
- 加载完数据后，停止加载动画

这里我们先看下加载动画的实现。我们在home.wxml底部加入下面的代码:

``` html
<view class="refresh-block" wx:if="{{loading}}">
    <image  src="../../res/images/loading.gif"></image>
</view>
```
目标是在页面的底部，根据loading布尔值来显示或者隐藏加载中的gif动画。

loading变量的默认值我们设置成false，即默认不显示:
``` js
  data: {
    activeTabId: 1,
    tabBottomSliderOffset:0,
    isDropDownMenuCollapse: true,
    hideTabBottomSlider: false,
    keywords: mock.home.keywords,
    notes: [],
    imgWidth: 0,
    loading: false,
  },
```
loading变量的操作会在下面的用户下拉事件处理函数中讲解。我们先看下加载动画的样式：

``` css
.refresh-block{
    display: flex;
    justify-content: center;

}
.refresh-block image{
    width:100rpx;
    height: 100rpx;
}
```
我们同样是通过flex布局来将gif动画居中显示，并且将动画设置成适当的大小。

页面上拉触底事件的处理函数就是onReachBottom，我们在里面进行无限加载和动画的逻辑处理:

``` js
  onReachBottom: function(e) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    this.loadNotes();

    setTimeout( () =>{
      this.setData({
        loading: false,
      })
    }, 2000)
  },
```
当触发下拉动作时，代码的逻辑如下：

- 如果页面已经在加载状态，立刻返回
- 如果页面不是在加载状态，则将loading设置成true，那么我们的页面底部就会显示加载中的动画
- 将mock中的笔记追加到已有笔记后面。小程序监控到data中的notes的变化，会自动重新渲染所有的笔记，包括新增加进来的这一批笔记。
- 模拟加载时间。在2秒后，将loading设置为false，从而将底部加载动画隐藏

加载动画显示效果如下：

![无限加载](http://upload-images.jianshu.io/upload_images/264714-287ccf55404ad7e6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 4. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuXiaoChengXu.git
- cd XiaoHuangShuXiaoChengXu/
- git checkout CH04

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
