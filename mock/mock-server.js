/**
 * @file mock server
 * @author iamswf@163.com
 */

const express = require('express');
const mockServiceMiddleware = require('./mockServiceMiddleware');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8090;
const uri = 'http://localhost:' + port;

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(mockServiceMiddleware);

app.listen(port, () => {
    console.log('> Starting dev server...');
    console.log('> Listening at ' + uri + '\n');
});
