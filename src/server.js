require('dotenv').config();
require('./middleware/passport');
const rateLimiter = require('./middleware/rate-limiter');
const db = require('./db/models/index.js');

// global variable
global._ = global._ || require('lodash');
global.logger = global.logger || require('./middleware/logger');

// packages
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

const PORT = process.env.PORT || 8085;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(rateLimiter);
app.use(compression());
app.use(
  session({
    secret: 'PowerRangerGogo',
    resave: false,
    saveUninitialized: true,
    key: 'madison',
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      // Cookie will expire in 1 hour from when it's generated
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  })
);
app.use(morgan('combined', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/webRoutes/routes.js')(app);

// DB
db.sequelize
  .authenticate()
  .then(() => {
    logger.info('CONNECTED TO DB!');
    app.listen(PORT, HOST);
    logger.info(`Running on http://${process.env.HOST}:${process.env.PORT}`);
  })
  .catch((err) => {
    logger.error(err);
    logger.info('Restarting ...');
    return process.exit(205); // exit and restart
  });
