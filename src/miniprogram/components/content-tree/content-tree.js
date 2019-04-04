Component({
    properties: {
        contents: {
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
        onSubContentClick(e) {
            const id = e.currentTarget.dataset.id;
            this.triggerEvent('subcontentclick', {id});
        }
    }
});
