const validator = require("validator");
const mongoose = require("mongoose");

exports.getDetailCategoryValidator = async (req, res, next) => {
	try {
		const errorMessages = [];
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return next({ message: "id is not valid", statusCode: 400 });
		}

		if (errorMessages.length > 0) {
			return next({ messages: errorMessages, statusCode: 400 });
		}

		next();
	} catch (error) {
		next(error);
	}
};

exports.cretaeOrUpdateCategoryValidator = async (req, res, next) => {
	try {
		const errorMessages = [];

		if (validator.isEmpty(req.body.category)) {
			errorMessages.push("Category must not be empty");
		}

		if (errorMessages.length > 0) {
			return next({ messages: errorMessages, statusCode: 400 });
		}

		next();
	} catch (error) {
		next(error);
	}
};
