const { createLogger, format, transports } = require('winston');
const { combine, json, colorize, simple } = format;

const logger = createLogger({
  level: 'info',
  format: combine(json(), colorize()),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log', level: 'debug' }),
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: simple(),
    })
  );
}

module.exports = logger;
