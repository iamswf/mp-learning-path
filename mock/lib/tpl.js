/**
 * @file 请求返回模板
 * @author iamswf@163.com
 */

module.exports = {
    success: () => {
        return {
            status: 0,
            data: {},
            error: null
        };
    },
    fail: errorStatus => {
        return {
            status: errorStatus || 2,
            data: {},
            errors: [{code: '0', message: '系统异常'}]
        };
    }
};
