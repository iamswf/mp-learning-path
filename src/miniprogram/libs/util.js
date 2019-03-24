
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