const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const reviewSchema = new mongoose.Schema(
	{
		id_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		id_movie: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "movie",
			required: true,
		},
		headline: {
			type: String,
		},
		comment: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			min: 0,
			max: 10,
			required: true,
		},
	},
	{
		timestamps: {
			createdAt: "createAt",
			updateAt: "updateAt",
		},
		toJSON: { virtuals: true, getters: true },
		toObject: { virtuals: true },
	}
);

reviewSchema.index(
	{
		id_user: 1,
		id_movie: 1,
	},
	{
		unique: true,
	}
);

reviewSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("review", reviewSchema);
