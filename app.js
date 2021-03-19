const mongoose = require('mongoose');
const program = require('commander');
const Promise = require('bluebird');
const { prompt } = require('inquirer');
const { execSync } = require('child_process');
require('dotenv').config();

const { db, model } = require('./db');
const log = require('./logger');

const question = require('./questions');

program.version('1.0.0');

program
	.command('create')
	.alias('add')
	.action(() =>
		prompt(question.create).then(({ title, description }) =>
			Promise.promisifyAll(db())
				.then(async () => {
					const session = await mongoose.startSession();
					try {
						await session.withTransaction(async () => {
							const user = await model.User.findOne({
								title,
							});
							if (user) {
								log.warn(
									`This user is in database ${
										(title, description)
									}!`
								);
								process.exit();
							}
						});
					} finally {
						session.endSession();
					}
				})
				.then(() =>
					model.User.create({
						title,
						description,
					}).then((user) => {
						log.debug(`New user created: ${user}`);
						execSync(`node getUser.js get ${user._id}`);
					})
				)
				.then(() => log.info('Job done!'))
				.catch((err) => log.error(err))
				.finally(() => process.exit())
		)
	);

program
	.command('find')
	.alias('f')
	.action(() =>
		prompt(question.find).then(({ title }) =>
			Promise.promisifyAll(db())
				.then(async () => {
					const search = new RegExp(title, 'i');
					const user = await model.User.find({
						$or: [{ title: search }],
					});
					log.debug(user);
					log.debug(`Number user ${user.length}`);
				})
				.then(() => log.info('Job done!'))
				.catch((err) => log.error(err))
				.finally(() => process.exit())
		)
	);

program.parse(process.argv);
