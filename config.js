/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
const host = 'da328a66.ngrok.io';
const protocol = 'https';
const version = 'v1';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${protocol}://${host}/${version}/auth/signin`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${protocol}://${host}/${version}/users`,

        // 测试的信道服务地址
        tunnelUrl: `https://${host}/tunnel`,
    }
};

module.exports = config;