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
    },

    /**
   * 组件的方法列表
   */
    methods: {
        bindContentPickerChange(e) {
            this.setData({
                contentIndex: +e.detail.value
            });
        },
        bindSubContentPickerChange(e) {
            this.setData({
                subContentIndex: +e.detail.value
            });
        },
        bindDateChange(e) {
            this.setData({
                date: e.detail.value
            });
        }
    },

    lifetimes: {
        attached() {
        }
    }
})
