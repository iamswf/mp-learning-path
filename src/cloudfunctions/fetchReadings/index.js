// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
    env: 'CLOUD_ENV'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const subCategoryId = event.subContentId;
    let res;
    const whereParams = subCategoryId ? {subCategoryId} : {};
    try {
        const readings = await db.collection('readings')
            .where(whereParams)
            .get();
        res = {
            status: 0,
            data: readings
        };
    } catch (err) {
        console.error(err);
        res = {
            status: 500,
            data: null
        };
    }
    return res;
};
