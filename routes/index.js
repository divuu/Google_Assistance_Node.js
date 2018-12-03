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
  res.json(data)
});

module.exports = router;
