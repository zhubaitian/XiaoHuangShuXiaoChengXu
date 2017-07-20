/**
 * Created by KevinZhu from Lathander on 18/06/2017.
 */

const config = require('./application');
const baseUrl = `${config.server.protocol}://${config.server.host}/${config.server.version}`;
module.exports = {
    login: {
        // 登录地址，用于建立会话
        loginUrl: `${baseUrl}/auth/signin`,
    },
    debug: {
        // 测试的请求地址，用于测试会话
        requestUrl: `${baseUrl}/users`,

        // 测试的信道服务地址
        tunnelUrl: `${baseUrl}/tunnel`,
    }
}