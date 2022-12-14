require('dotenv-flow').config();
require('express-async-errors');
const path = require('path');
const cors = require('cors');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fallback = require('express-history-api-fallback');

const { name, version } = require('../package.json');
const logger = require('./libs/logger');
const time = require('./libs/time');

const app = express();

app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: '1 mb' }));
app.use(express.urlencoded({ extended: true, limit: '1 mb' }));

app.use(function (req, res, next) {
  req.originalPath = req.originalUrl.split("?")[0];

  logger.info(`[${time.utc()}] [${req.method.toUpperCase()}] ${req.originalPath}`);
  logger.info(`[query]:${JSON.stringify(req.query)} \n[body]:${JSON.stringify(req.body)} \n\r`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With,x-jwt-token");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if(req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();

});

const router = express.Router();
router.use('/api', require('./routes'));

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production' || process.env.ABT_NODE_SERVICE_ENV === 'production';

if (isProduction) {
  app.use(cors());
  app.use(compression());

  const staticDir = path.resolve(process.env.BLOCKLET_APP_DIR, 'build');
  app.use(express.static(staticDir, { maxAge: '30d', index: false }));
  app.use(router);
  app.use(fallback('index.html', { root: staticDir }));

  app.use((req, res) => {
    res.status(404).send('404 NOT FOUND');
  });
  app.use((err, req, res) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });
} else {
  app.use(router);
}

const port = (isDevelopment ? parseInt(process.env.API_PORT, 10) : parseInt(process.env.BLOCKLET_PORT, 10)) || 3030;

app.listen(port, (err) => {
  if (err) throw err;
  logger.info(`> ${name} v${version} ready on ${port}`);
  require('./schedule/keep_cookie_alive')();
});
