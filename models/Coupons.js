const mongoose = require('mongoose');
var sys = require(__dirname + '/../config/System');
const _ = require('underscore');


var db = mongoose.connect(sys.db_uri, {useMongoClient: true });
mongoose.Promise =require('bluebird');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const couponSchema = new Schema({
	ownerid: { type: Schema.Types.ObjectId, ref: 'User' },
	name: { type: String,required: true},
	bizid: { type: Schema.Types.ObjectId, ref: 'Business' },
	description: String,
	type: String,
	tagline: String,
	photo: String,
	star: Boolean,
	startcoupondate: Date,
	endcoupondate: Date,
	order: Number,
	users: [
		{
			user_id: { type: Schema.Types.ObjectId, ref: 'User'},
			code: String,
			status: Boolean
		}
	],
	status: Boolean
});

couponSchema.pre('save', function (next) {
    this.users = _.uniq(this.users, function(x){
      return x.user_id;
	});
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
