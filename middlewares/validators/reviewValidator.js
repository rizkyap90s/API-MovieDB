const validator = require("validator");
const mongoose = require("mongoose");

exports.getReviewValidator = async (req, res, next) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id_movie)) {
			return next({ message: "id is not valid", statusCode: 400 });
		}

		next();
	} catch (error) {
		next(error);
	}
};

exports.createOrUpdateReviewValidator = async (req, res, next) => {
	try {
		const errorMessages = [];

		if (validator.isEmpty(req.body.comment)) {
			errorMessages.push("Comment must not be empty");
		}

		if (validator.isEmpty(req.body.rating)) {
			errorMessages.push("Rating must not be empty");
		}

		if (!validator.isInt(req.body.rating)) {
			errorMessages.push("Rating must be a number (integer)");
		}

		if (errorMessages.length > 0) {
			return next({ messages: errorMessages, statusCode: 400 });
		}

		next();
	} catch (error) {
		next(error);
	}
};
