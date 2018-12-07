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
const signInPayload = {
  "payload":{
    "google": {
      "expectUserResponse": true,
      "systemIntent": {
        "intent": "actions.intent.SIGN_IN",
        "data": {}
      }
    }
  }
}
const CLIENT_ID = "808427351381-k59o1kn1ueiqg1dsc6h2lrhs43387c75.apps.googleusercontent.com"
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function (req, res, next) {
  //checking data
  console.log("Request", req.body);
  console.log("Payload", req.body.originalDetectIntentRequest.payload);
  console.log("Token", req.body.originalDetectIntentRequest.payload.user.accessToken);
  if (req.body.queryResult.action === "action_register") {
    //create a deep copy
    if(req.body.originalDetectIntentRequest.payload.user.accessToken == undefined)
      res.json(signInPayload);
    else{
      thisResponse = JSON.parse(JSON.stringify(basicResponse));
      res.json(register(thisResponse, req.body));
    }
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
