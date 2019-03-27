/**
 * @file util
 * @author iamswf@163.com
 */


/**
 * promisify
 *
 * @param {Function} api function
 * @return {Promise}
 */
export const promisify = api => (options, ...params) =>
    new Promise((resolve, reject) => {
        api(Object.assign({}, options, {success: resolve, fail: reject}), ...params);
    });

/**
 * 随机字串
 *
 * @param {number} len length
 * @return {string} string
 */
const rand16Num = (len = 0) => {
    const result = [];
    for (let i = 0; i < len; i++) {
        result.push('0123456789abcdef'.charAt(
            Math.floor(Math.random() * 16))
        );
    }
    return result.join('');
};

/**
 * 生成一个全局唯一的guid，且格式符合guid规范
 * GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”
 * 其中每个 x 是 0-9 或 a-f 范围内的一个32位十六进制数
 * 第四版的GUID使用了新的算法，其产生的数字是一个伪随机数。
 * 它生成的GUID的第三组数字的第一位是4
 *
 * @return {string} 符合guid格式的字符串
 */
export const guid = () => {
    const curr = (new Date()).valueOf().toString();
    return [
        '4b534c47',
        rand16Num(4),
        `4${rand16Num(3)}`,
        rand16Num(4),
        curr.substring(0, 12)
    ].join('-');
};
