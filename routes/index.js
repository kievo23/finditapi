let express = require('express');
let router = express.Router();
let sys = require(__dirname + '/../config/System');
let User = require('./../models/User');
let Business = require('./../models/Business');
let Category = require(__dirname + '/../models/Category');
let Coupons = require(__dirname + '/../models/Coupons');
let Reviews = require(__dirname + '/../models/Reviews');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Findit Mobile Api' });
});

//  FETCH CATEGORIES FOR BUSINESSES
router.get('/general/categories', async (req, res, next)=> {
  let categories = await Category.find({approved: true,group: 'general'}).sort([['order', 1]]);
  res.status(200).json({code: 100,data: categories});
})

//  FETCH CATEGORIES FOR PRODUCTS PART
router.get('/shopping/categories', async (req, res, next)=> {
  let categories = await Category.find({group: 'shopping'}).sort([['order', 1]]);
  res.status(200).json({code: 100, data: categories});
})

router.get('/coupons', async(req, res, next)=> {
  let coupons = await Coupons.find({
    status: true
  }).populate('bizid').sort([['order', 1], ['star', -1]]).limit(10);
  res.status(200).json({code: 100, data: coupons});
})

router.get('/reviews', async(req, res, next)=> {
  let reviews = await Reviews.find().sort([['created_at', -1]]).populate('bizid').populate('user_id').limit(5);
  res.status(200).json({code: 100,data: reviews});
})

module.exports = router;
