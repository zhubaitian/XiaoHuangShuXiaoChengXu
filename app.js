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