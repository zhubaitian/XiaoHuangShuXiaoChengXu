/**
 * @fileOverview 微信小程序的入口文件
 */

var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config/application');
const api = require('./config/api');
const toast = require('./libs/Toast');

App({
  /**
   * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
   */
  onLaunch() {
    qcloud.setLoginUrl(api.login.loginUrl);

    toast.showBusy('正在登录');

    // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
    qcloud.login({
      success(result) {
        toast.showSuccess('登录成功');
        console.log('登录成功', result);
      },

      fail(error) {
        toast.showModel('登录失败', error);
        console.log('登录失败', error);
      }
    });
  }
});