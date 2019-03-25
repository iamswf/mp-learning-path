Component({
    /**
   * 组件的属性列表
   */
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        width: {
            type: String,
            value: '92vw'
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
        onClose(e) {
            this.setData({
                show: false
            });
        }
    }
})
