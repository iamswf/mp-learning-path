// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
    env: 'CLOUD_ENV'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    const {content, subContent} = event.data;
    let categoryId;
    let subCategoryId;
    if (!content._id) {
        const contentAddResult = await db.collection('reading_category').add({
            data: {
                name: content.name
            }
        });
        categoryId = contentAddResult._id;
    } else {
        categoryId = content._id;
    }
    if (!subContent._id) {
        const subContentAddResult = await db.collection('reading_sub_category').add({
            data: {
                name: subContent.name,
                categoryId
            }
        });
        subCategoryId = subContentAddResult._id;
    } else {
        subCategoryId = subContent._id;
    }
    let res;
    try {
        const readingItemAddResult = await db.collection('readings').add({
            data: {
                title: event.data.title,
                description: event.data.description,
                imageUrl: event.data.imageFileId,
                readDate: event.data.date,
                subCategoryId
            }
        });
        res = {
            status: 0,
            id: readingItemAddResult._id
        };
    } catch (err) {
        res = {
            status: 500,
            id: null
        };
        console.error(err);
    }
    return res;
};