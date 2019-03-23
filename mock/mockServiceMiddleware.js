/**
 * @file mock server middleware
 * @author iamswf@163.com
 */

const url = require('url');
const path = require('path');
const mockService = require('mockservice');

mockService.config({
    name: 'mp-learning-path',
    dir: path.resolve(process.cwd(), './mock')
});

const mockServer = (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const serve = mockService.serve;
    request.query = parsedUrl.query;
    serve(request, response);
};

const isAjax = path => {
    const ajaxPathRegExps = [
        /swf-abc/,
    ];

    let res = false;
    for (let i = 0; i < ajaxPathRegExps.length; i++) {
        if (ajaxPathRegExps[i].test(path)) {
            res = true;
            break;
        }
    }
    return res;
}

module.exports = (req, res, next) => {
    const parsedUrl = url.parse(req.url);
    if (isAjax(parsedUrl.pathname)) {
        const params = req.method.toLowerCase() === 'post' ? {...req.body} : {...parsedUrl.query};
        req.url = `request.ajax?path=${parsedUrl.pathname.slice(1)}&params=${JSON.stringify(params)}`;
        req.body.toString = () => JSON.stringify(req.body);
        mockServer(req, res);
    }
    else {
        next();
    }
};
