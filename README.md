# 第五章 微信小程序授权登录

在上一篇文章中，我们在后台实现了会员管理以及会员注册登录的逻辑。其中登录方式包括：

- 通过手机号码和验证码登录
- 通过微信授权登录

在小黄书小程序上，我们支持第二种登录方式。第一种方式，今后看情况再酌情进行支持。

我们这一章节要做的事情就是在小程序客户端支持上微信授权登录，我们的目标是：
- 在小黄书小程序打开时，通过微信授权进行登录。
- 登录成功后，将访问令牌存放到小程序提供的本地缓存中。

# 1. 小程序登录流程
---
在上一章中，我们已经看过了小程序官方给出的登录时序图：

![小程序登录时序图](http://upload-images.jianshu.io/upload_images/264714-28a63ee90020eac8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

根据上一章的描述，我们的登录时序跟官方的稍微有点不一样。因为我们除了需要通过wx.login返回的code登录凭证获取到用户的openid之外，还需要取得微信用户的头像甚至unionid等信息，所以我们还需要小程序调用wx.getUserInfo的接口来获得微信用户的加密信息encryptedData以及初始解码向量iv，一并传给服务器来进行登录。

所以我们这里主要看下需要用到的两个api的主要功能。

# 1.1. wx.login

>调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）。用户数据的加解密通讯需要依赖会话密钥完成。

下面是一个调用示例：

``` js
//app.js
App({
  onLaunch: function() {
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin', // 服务器暴露的登录api地址
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
})
```

## 1.2. wx.getUserInfo

这个接口的主要功能就是获取微信用户的信息。但必须要在调用上面的wx.login接口之后进行调用。返回的结果：


| 参数        | 类型           | 说明
| ------------- |:-------------:| -----:|
| userInfo | OBJECT | 用户信息对象，不包含 openid 等敏感信息|
| rawData| String|不包括敏感信息的原始数据字符串，用于计算签名。|
| signature| String|使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 [signature](https://mp.weixin.qq.com/debug/wxadoc/dev/api/signature.html)。|
| encryptedData| String|包括敏感数据在内的完整用户信息的加密数据，详细见[加密数据解密算法](https://mp.weixin.qq.com/debug/wxadoc/dev/api/signature.html#加密数据解密算法)|
| iv| String|加密算法的初始向量，详细见[加密数据解密算法](https://mp.weixin.qq.com/debug/wxadoc/dev/api/signature.html#加密数据解密算法)|

从中可以看到，我们需要传送到服务器端的包含用户完整信息的加密后的encryptedData和解密初始向量iv都在返回结果里面。我们只需要从返回结果中取出这些信息，和wx.login返回的登录凭证code一起发送给服务器进行signin请求，就能进行微信的授权登录过程。

#2. 微信授权登录实现
---

如上所述，小程序客户端的微信授权登录需要做的事情就是：

- 通过wx.login获取到登录凭证code
- 然后通过wx.getUserInfo获取到微信用户的完整加密数据以及用于解密的初始向量iv
- 将这些数据发给服务器并请求signin接口来进行登录
- 服务器通过code调用code2session的微信服务器接口来获得微信用户的openid和用来解密encryptedData的session_key，然后对encryptedData进行解密并获取到微信用户的完整信息，进行注册或登录操作，并生成服务器的访问凭证返回给客户端
- 小程序客户端在获取到access_token访问凭证后，将其存储在微信小程序的本地缓存中，这样，今后调用需要授权的服务器端请求时，就可以带上这个访问凭证来进行授权调用了


在app.json中实现的在小程序加载期间进行微信授权登录的代码如下:

``` js
//app.js

const config = require('./config/application');

App({
  onLaunch: function () {
    this.signin(function(userInfo) {
      console.log('userInfo:',userInfo);
    })
  },
  signin:function(cb) {
    var that = this
    //调用登录接口以获取code
    wx.login({
      success: function (res) {
        const code = res.code;
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);

              // 调用服务器登录接口获取access_token
              wx.request({
                url: `${config.server.protocol}://${config.server.url}/${config.server.version}/auth/signin`,
                data: {
                  wxcode: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                method: 'POST',
                json: true,
                success: function (res) {
                  console.log('response:', res);
                  wx.setStorageSync('access_token', res.data);
                }
              })
            }
          })
        } else {
          console.log('wx.login failed：' + res.errMsg);
        }
      }
    })
  },
  globalData:{
    userInfo:null,
  }
})
```
整个流程和上面的描述并无二致。其中服务器的相关访问信息我们封装到config/application.js文件里面。参考内容如下，大家可以根据自己的情况进行修改：

``` js
module.exports = {
    server: {
        protocol: 'http',
        url: '2a90e26a.ngrok.io',
        version: 'v1',
    }
}
```

顺便提一下，我使用的内网穿透工具是ngrok，所以才有以上的url格式。当然，调试期间我们可以直接访问localhost的3000端口来访问到我们的小黄书服务器。

#3. wafer-client-sdk库
---

我们上面描述了小程序登录的一个脉络，但是很不完善的。比如我们没有用到时序图上面的checksession来对登录态进行检查等。

事实上，腾讯云已经为我们提供了一个wafer-client-sdk来帮我们处理完整的登录会话管理功能。详情请查看：
https://github.com/tencentyun/wafer-client-sdk

我们只需要做一些修改，就能满足我们的需求。详细代码就不列出来了，相信大家把代码pull下来看下就明白了。同时，index页面有官方提供的页面示例，大家也可以修改下app.json来指向该页面进行调试。


# 4. 结语
---

详细实现请查看github中的代码。
-  git clone https://github.com/zhubaitian/XiaoHuangShuXiaoChengXu.git
- cd XiaoHuangShuXiaoChengXu/
- git checkout CH05

---
>本文由天地会珠海分舵编写，转载需授权，喜欢点个赞，吐槽请评论，进一步交流请关注公众号**techgogogo**或者直接联系本人微信**zhubaitian1**
