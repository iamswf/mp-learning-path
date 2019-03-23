// 云函数入口文件
const cloud = require('wx-server-sdk')
const DEVELOPMENT_CLOUD_ENV = 'test-c906c7';
cloud.init({
    env: DEVELOPMENT_CLOUD_ENV
})
const wxContext = cloud.getWXContext()
const db = cloud.database()

async function fetchReadingSubCategory() {
    return db.collection('reading_sub_category').get();
}

async function fetchReadingCategory() {
    return db.collection('reading_category').get();
}

// 云函数入口函数
exports.main = async (event, context) => {
    let res = [];
    try {
        const cats = await Promise.all([fetchReadingSubCategory(), fetchReadingCategory()]);
        const subCategorys = cats[0].data;
        const categorys = cats[1].data;
        res = categorys.map(category => {
            return {
                ...category,
                subContents: subCategorys.filter(sub => sub.categoryId === category._id)
            };
        });
    } catch (err) {
        console.error(err);
    }
    return res;
}