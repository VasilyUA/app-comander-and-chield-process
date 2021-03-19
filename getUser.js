const program = require('commander');
const Promise = require('bluebird');
require('dotenv').config();
const { db, model } = require('./db');
const log = require('./logger');

program.version('1.0.0');

program
	.command('get <id>')
	.alias('-g')
	.action((id) =>
		Promise.promisifyAll(db())
			.then(async () => {
				await model.User.updateOne(
					{ _id: id },
					{ title: 'God job' }
				);
			})
			.then(() => log.info('Job done!'))
			.catch((err) => log.error(err))
			.finally(() => process.exit())
	);

program.parse(process.argv);
