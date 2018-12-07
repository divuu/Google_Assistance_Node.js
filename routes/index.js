var express = require('express');
var router = express.Router();
let basicResponse = {
  "fulfillmentText": "There was some error on our side. Please try again later. Thank You!",
  "payload": {
    "google": {
      "expectUserResponse": false,
    }
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next){
  if(req.body.queryResult.action === "action_register"){
    basicResponse.fulfillmentText = `Welcome to Route Alert! Good to have you with us. I have registered your number ${req.body.queryResult.parameters.phone}. Thank you.`
    res.json(basicResponse);
  }else{
    res.json(basicResponse);
  }
});

module.exports = router;
