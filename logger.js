const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf, colorize } = format;
const logFormat = printf(
	// eslint-disable-next-line no-shadow
	({ level, message, label, timestamp }) =>
		`${timestamp} [${label}] ${level}: ${message}`
);

const logger = createLogger({
	transports: [
		new transports.Console({
			level: 'debug',
			handleExceptions: true,
			format: combine(
				colorize(),
				label({ label: 'app' }),
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				logFormat
			),
		}),
	],
	exitOnError: false, // do not exit on handled exceptions
});

logger.debug = new Proxy(logger.debug, {
	apply(target, that, args) {
		return target(args);
	},
});

logger.error = (err = {}, customMessage = '') => {
	logger.log({
		level: 'error',
		message: `${customMessage} - ${err}`,
	});
};

module.exports = logger;
