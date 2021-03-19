const mongoose = require('mongoose');
exports.db = () =>
	mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});

exports.model = { User: require('./models/users') };
