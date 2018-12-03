var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next){
  let data  = {
    'testing': true
  }
  console.log(req.body);
  console.log("User", req.body.originalDetectIntentRequest.payload.user);
  res.json(data)
});

module.exports = router;
