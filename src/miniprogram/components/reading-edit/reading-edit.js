/**
 * @file reading-edit component
 * @author iamswf@163.com
 */

import {guid} from '../../libs/util';
import {promisify} from '../../libs/util';

const wxChooseImage = promisify(wx.chooseImage);
const wxGetImageInfo = promisify(wx.getImageInfo);
const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath);

const adjustReadingContents = contents => {
    const adjustedConents = [
        {
            name: '请选择阅读题材',
            subContents: []
        },
        ...contents
    ].map(item => {
        return {
            ...item,
            subContents: [
                {
                    name: '请选择阅读子类'
                },
                ...item.subContents
            ]
        }
    });
    return adjustedConents;
};

const validate = data => {
    const {
        title,
        description,
        contentIndex,
        subContentIndex,
        newContent,
        newSubContent,
        imageFileId
    } = data;
    let res = {
        isValid: true,
        message: ''
    };
    let isValid = true;
    let message = '';
    if (!title) {
        res.isValid = false;
        res.message = '请填写阅读标题';
        return res;
    }
    if (!description) {
        res.isValid = false;
        res.message = '请填写简短介绍';
        return res;
    }
    if (contentIndex === 0 && !newContent) {
        res.isValid = false;
        res.message = '请选择或新建阅读题材';
        return res;
    }
    if (newContent) {
        if (!newSubContent) {
            res.isValid = false;
            res.message = '已新建阅读题材，请继续新建阅读子类';
            return res;
        }
    } else if (subContentIndex === 0 && !newSubContent) {
        res.isValid = false;
        res.message = '请选择或新建阅读子类';
        return res;
    }
    if (!imageFileId) {
        res.isValid = false;
        res.message = '请上传阅读数据封面或者截图';
        return res;
    }
    return res;
};

const collectData = data => {
    const {
        title,
        description,
        contentIndex,
        subContentIndex,
        newContent,
        newSubContent,
        date,
        imageFileId
    } = data;
    let content;
    let subContent;
    if (newContent) {
        // 如果有新建阅读题裁，则按新建走
        content = {name: newContent};
        subContent = {name: newSubContent};
    } else if (newSubContent) {
        // 如果是选择已有题裁，并且新建子类，则按新建子类走
        content = data.adjustedExistingContents[contentIndex];
        subContent = {name: newSubContent};
    } else {
        content = data.adjustedExistingContents[contentIndex];
        subContent = content[subContentIndex];
    }
    return {
        title,
        description,
        content,
        subContent,
        date,
        imageFileId
    };
};

Component({
    /**
   * 组件的属性列表
   */
    properties: {
        existingContents: {
            type: Array,
            value: [],
            observer(newVal, oldVal, changedPath) {
                // 属性被改变时执行的函数（可选），通常 newVal 就是新设置的数据， oldVal 是旧数
                // 新版本基础库不推荐使用这个字段，而是使用 Component 构造器的 observer 字段代替（这样会有更强的功能和更好的性能）
            }
        }
    },

    /**
   * 组件的初始数据
   */
    data: {
        title: '',
        description: '',
        contentIndex: 0,
        subContentIndex: 0,
        newContent: '',
        newSubContent: '',
        date: '1990-03-13',
        imageFileId: '',
        isSubmitBtnDisabled: true,
        isSaving: false
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
                this.setData({
                    imageFileId: res.fileID
                });
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
            const validationRes = validate(this.data);
            if (!validationRes.isValid) {
                wx.showToast({
                    title: validationRes.message,
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            const dataToSubmit = collectData(this.data);
            this.triggerEvent('submit', dataToSubmit, {});
        }
    },

    observers: {
        'existingContents': function (existingContents) {
            const adjustedExistingContents = adjustReadingContents(existingContents);
            this.setData({
                adjustedExistingContents
            });
        }
    },

    lifetimes: {
        attached() {
        }
    }
})
