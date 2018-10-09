const express = require('express');
const app = express();
const logger = require('morgan');

const routeConfig = require('./config/route-config.js');
const appConfig = require('./config/main-config.js');

appConfig.init(app, express);
routeConfig.init(app);
app.use(logger('dev'));

module.exports = app;
