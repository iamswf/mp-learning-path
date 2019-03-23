// 云函数入口文件
const cloud = require('wx-server-sdk')
const DEVELOPMENT_CLOUD_ENV = 'test-c906c7';
cloud.init({
    env: DEVELOPMENT_CLOUD_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    let res;
    try {
        res = await db.collection('readings').get()
        console.log('readings res', res);
    } catch (err) {
        console.error('errrrrr', err)
    }
    return res;
}