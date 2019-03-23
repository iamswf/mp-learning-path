/**
 * @file 首页
 * @author iamswf@163.com
 */

import commonConfig from '../../config/common';

const props = {
    data: {
        currentView: commonConfig.VIEW_TYPE.CATALOG,
        contents: [],
        feedData: [],
        size: 0,
    },
    onLoad() {
        wx.cloud.callFunction({
            name: 'fetchReadings',
            data: {},
            success: (res) => {
                console.log(res);
                this.setData({
                    feedData: res.result.data
                })
            },
            fail: console.log
        });
        wx.cloud.callFunction({
            name: 'fetchReadingContent',
            data: {},
            success: (res) => {
                this.setData({
                    contents: res.result,
                });
            },
            fail: console.log,
        });
    },
    onClick() {
        const me = this;
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album'],
            success(res) {
                console.log(res.tempFilePaths);
                console.log(res.tempFiles);
                const filePath = res.tempFilePaths[0];
                wx.getImageInfo({
                    src: filePath,
                    success(res) {
                        const ctx = wx.createCanvasContext('photo_canvas');
                        let ratio = 10;
                        let canvasWidth = res.width;
                        let canvasHeight = res.height;
                        // _this.setData({
                        //   aaa: photo.tempFilePaths[0],
                        //   canvasWidth2: res.width,
                        //   canvasHeight2: res.height
                        // })
                        // 保证宽高均在200以内
                        while (canvasWidth > 100 || canvasHeight > 100) {
                            // 比例取整
                            canvasWidth = Math.trunc(res.width / ratio);
                            canvasHeight = Math.trunc(res.height / ratio);
                            ratio++;
                        }
                        // _this.setData({
                        //   canvasWidth: canvasWidth,
                        //   canvasHeight: canvasHeight
                        // })//设置canvas尺寸
                        ctx.drawImage(filePath, 0, 0, canvasWidth, canvasHeight); // 将图片填充在canvas上
                        ctx.draw();
                        // 下载canvas图片
                        setTimeout(() => {
                            wx.canvasToTempFilePath({
                                canvasId: 'photo_canvas',
                                success(res) {
                                    console.log(res.tempFilePath);
                                    wx.cloud.uploadFile({
                                        cloudPath: 'reading/test.jpg', // 上传至云端的路径
                                        filePath: res.tempFilePath, // 小程序临时文件路径
                                        success: (res) => {
                                            // 返回文件 ID
                                            console.log(res.fileID);
                                        },
                                        fail: console.error,
                                    });
                                },
                                fail(error) {
                                    console.log(error);
                                },
                            });
                        }, 100);
                    },
                });
            },
            fail(err) {
                console.error(err);
            },
        });
    },
    onToggle() {
        const newView = this.data.currentView === commonConfig.VIEW_TYPE.CATALOG
            ? commonConfig.VIEW_TYPE.CONTENT
            : commonConfig.VIEW_TYPE.CATALOG;
        this.setData({
            currentView: newView,
        });
    },
};

Page(props);
