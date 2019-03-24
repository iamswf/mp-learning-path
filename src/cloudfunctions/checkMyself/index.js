/**
 * @file 验证用户身份是否是自己
 * @author iamswf@163.com
 */

const rp = require('request-promise');
const {APP_ID, APP_SECRET, MY_OPEN_ID} = require('./__config');

exports.main = async (event, context) => {
    const code = event.code;
    let isMyself = false;
    try {
        res = await rp({
            method: 'get',
            uri: `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`,
            json: true
        });
        isMyself = res.openid === MY_OPEN_ID;
    } catch (err) {
        console.error(err);
    }
    return isMyself;
}