import commonConfig from '../../config/common';

Component({
    /**
   * 组件的属性列表
   */
    properties: {
        type: {
            type: Number,
            value: commonConfig.TAB.READING
        },
        data: {
            type: Array,
            value: []
        }
    },

    /**
   * 组件的初始数据
   */
    data: {

    },

    /**
   * 组件的方法列表
   */
    methods: {

    },

    lifetimes: {
        attached() {
        }
    },

    observers: {
        'data': function (data) {
        }
    }
})
