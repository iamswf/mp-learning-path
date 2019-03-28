/**
 * @file reading-edit component
 * @author iamswf@163.com
 */

import {guid} from '../../libs/util';
import {promisify} from '../../libs/util';

const wxChooseImage = promisify(wx.chooseImage);
const wxGetImageInfo = promisify(wx.getImageInfo);
const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath);

Component({
    /**
   * 组件的属性列表
   */
    properties: {
        existingContents: {
            type: Array,
            value: []
        },
        contentIndex: {
            type: Number,
            value: 0
        },
        subContentIndex: {
            type: Number,
            value: 0
        },
        date: {
            type: String,
            value: '2016-03-12'
        }
    },

    /**
   * 组件的初始数据
   */
    data: {
        title: '',
        description: '',
        isSaving: false,
        newContent: '',
        subContent: ''
    },

    /**
   * 组件的方法列表
   */
    methods: {
        onTitleChange(e) {
            this.setData({
                title: e.detail.value
            });
        },
        onDescriptionChange(e) {
            this.setData({
                description: e.detail.value
            });
        },
        onContentPickerChange(e) {
            this.setData({
                contentIndex: +e.detail.value,
                subContentIndex: 0
            });
        },
        onNewContentChange(e) {
            this.setData({
                newContent: e.detail.value
            });
        },
        onSubContentPickerChange(e) {
            this.setData({
                subContentIndex: +e.detail.value
            });
        },
        onNewSubContentChange(e) {
            this.setData({
                newSubContent: e.detail.value
            });
        },
        onDateChange(e) {
            this.setData({
                date: e.detail.value
            });
        },
        onPicUploadBtnClick(e) {
            // 选择本地图片
            wxChooseImage({
                sizeType: ['compressed'],
                sourceType: ['album']
            }).then(res => {
                // 获取宽高等图片信息
                const filePath = res.tempFilePaths[0];
                return wxGetImageInfo({
                    src: filePath
                }).then(res => ({...res, filePath}))
                    .catch(err => {throw err;});
            }).then(res => {
                // canvas渲染压缩并临时存储
                const {width, height, filePath} = res;
                const ctx = wx.createCanvasContext('photo_canvas', this);
                const canvasHeight = 100;
                const canvasWidth = Math.min(width / height * canvasHeight, 300);
                ctx.drawImage(filePath, 0, 0, canvasWidth, canvasHeight);
                return new Promise((resolve, reject) => {
                    ctx.draw(false, () => {
                        wxCanvasToTempFilePath({
                            canvasId: 'photo_canvas',
                            x: 0,
                            y: 0,
                            width: canvasWidth,
                            height: canvasHeight,
                            fileType: 'jpg',
                            quality: 0.8
                        }, this).then(resolve).catch(reject);
                    });
                });
            }).then(res => {
                // 将临时存储的压缩后图片上传
                const readingImageCloudPath = `image/reading/${guid()}.jpg`;
                return wx.cloud.uploadFile({
                    cloudPath: readingImageCloudPath,
                    filePath: res.tempFilePath
                });
            }).then(res => {
                debugger
                console.log(res.fileID);
            }).catch(err => {
                console.error(err);
            });
        },
        onCancelBtnClick(e) {
            const cancelEventDetail = {}; // detail对象，提供给事件监听函数
            const cancelEventOption = {}; // 触发事件的选项
            this.triggerEvent('cancel', cancelEventDetail, cancelEventOption);
        },
        onSubmitBtnClick(e) {
            // TODO 收集并校验数据合法性
            const title = this.data.title;
            const description = this.data.description;
            debugger
            const submitEventDetail = {};
            const submitEventOption = {};
            this.triggerEvent('submit', submitEventDetail, submitEventOption);
        }
    },

    lifetimes: {
        attached() {
        }
    }
})
