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
    }
};

Page(props);
