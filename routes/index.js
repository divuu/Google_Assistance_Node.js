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
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function (req, res, next) {
  if (req.body.queryResult.action === "action_register") {
    //create a deep copy
    thisResponse = JSON.parse(JSON.stringify(basicResponse));
    
    res.json(register(thisResponse, req.body));
  } else {
    res.json(basicResponse);
  }
});

// handles registration process
// adds in the data base
function register(bResponse, requestObj) {
  //logic to add to db
  bResponse.fulfillmentText = `Welcome to Route Alert! Good to have you with us. I have registered your number ${requestObj.queryResult.parameters.phone}. Thank you.`
  return bResponse;
}
module.exports = router;
