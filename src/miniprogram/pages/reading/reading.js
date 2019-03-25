/**
 * @file 首页
 * @author iamswf@163.com
 */

import commonConfig from '../../config/common';
import {promisify} from '../../libs/util';

const props = {
    data: {
        currentView: commonConfig.VIEW_TYPE.CONTENT,
        currentEditType: commonConfig.EDIT_TYPE.NONE,
        contents: [],
        feedData: [],
        size: 0,
        isMyself: true
    },
    getUserInfo(res) {
        const me = this;
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求
                    console.log(res.code);
                    wx.cloud.callFunction({
                        name: 'checkMyself',
                        data: {code: res.code},
                        success: (res) => {
                            console.log('checkMyselfres', res);
                            // me.setData({
                            //     isMyself: res.result
                            // });
                        },
                        fail: console.log
                    });
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    onLoad() {
        this.getUserInfo();
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
    onAdd() {
        this.setData({
            currentEditType: commonConfig.EDIT_TYPE.ADD
        });
    }
};

Page(props);
