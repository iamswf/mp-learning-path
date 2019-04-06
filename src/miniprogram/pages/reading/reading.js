/**
 * @file 首页
 * @author iamswf@163.com
 */

import commonConfig from '../../config/common';
import {promisify} from '../../libs/util';

const wxLogin = promisify(wx.login);

const CONTENT_ALL_ID = '0';

const props = {
    data: {
        currentView: commonConfig.VIEW_TYPE.CONTENT,
        currentEditType: commonConfig.EDIT_TYPE.NONE,
        isEditing: false,
        contents: [],
        contentTreeData: [],
        currentSelectedContentId: CONTENT_ALL_ID,
        feedData: [],
        size: 0,
        isMyself: false,
        isFetching: false
    },
    checkMyself() {
        wxLogin()
            .then(res => res.code)
            .then(code => {
                return wx.cloud.callFunction({
                    name: 'checkMyself',
                    data: {code}
                });
            }).then(res => {
                this.setData({
                    isMyself: res.result
                });
            }).catch(err => {
                console.error(err);
            });
    },
    onLoad() {
        // 验证是否是自己
        this.checkMyself();
        // 获取阅读feed流数据
        this.fetchReadings();
        // 获取阅读目录
        wx.cloud.callFunction({
            name: 'fetchReadingContent',
            data: {}
        }).then(res => {
            const contents = res.result;
            const contentTreeData = [
                {
                    name: '全部',
                    _id: CONTENT_ALL_ID,
                    subContents: []
                },
                ...contents
            ];
            this.setData({
                contents,
                contentTreeData
            });
        }).catch(console.error);
    },
    fetchReadings(options = {}) {
        this.setData({
            isFetching: true
        });
        const {subContentId} = options;
        const fetchParams = {};
        if (subContentId) {
            fetchParams.subContentId = subContentId;
        }
        wx.cloud.callFunction({
            name: 'fetchReadings',
            data: fetchParams
        }).then(res => {
            const {status, data} = res.result;
            if (status === 0) {
                this.setData({
                    feedData: res.result.data.data,
                    isFetching: false
                });
            } else {
                this.setData({
                    isFetching: false
                });
                console.error('readings数据请求错误');
            }
        }).catch(err => {
            console.error(err);
            this.setData({
                isFetching: false
            });
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
            currentEditType: commonConfig.EDIT_TYPE.ADD,
            isEditing: true
        });
    },
    onCloseEditDialog() {
        this.setData({
            isEditing: false
        });
    },
    onCancelEdit() {
        this.setData({
            isEditing: false
        });
    },
    onSubmitEdit(e) {
        const dataToSubmit = e.detail;
        wx.cloud.callFunction({
            name: 'addReadingItem',
            data: {
                data: dataToSubmit
            }
        }).then(res => {
            this.setData({
                isEditing: false
            });
        }).catch(console.error);
    },
    onContentClick(e) {
        const contentId = e.detail.id;
        // clear feed data first
        this.setData({
            feedData: []
        });
        if (contentId === CONTENT_ALL_ID) {
            this.fetchReadings();
        } else {
            this.fetchReadings({
                contentId
            });
        }
        this.setData({
            currentView: commonConfig.VIEW_TYPE.CONTENT,
            currentSelectedContentId: contentId
        });
    },
    onSubContentClick(e) {
        const subContentId = e.detail.id;
        // clear feed data first
        this.setData({
            feedData: []
        });
        this.fetchReadings({subContentId});
        this.setData({
            currentView: commonConfig.VIEW_TYPE.CONTENT,
            currentSelectedContentId: subContentId
        });
    }
};

Page(props);
