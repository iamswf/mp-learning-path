// app.js
App({
    onLaunch() {
        const DEVELOPMENT_CLOUD_ENV = 'test-c906c7';

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                traceUser: true,
                env: DEVELOPMENT_CLOUD_ENV,
            });
        }

        this.globalData = {};
    },
});
