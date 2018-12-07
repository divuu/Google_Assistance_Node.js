let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require("../assets/keys.json");
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
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function (req, res, next) {
  //checking data
  console.log("Request", req.body);
  console.log("Payload", req.body.originalDetectIntentRequest.payload);
  // console.log("Token", req.body.originalDetectIntentRequest.payload.user.idToken);
  console.log("User", verifyJWT(req.body.originalDetectIntentRequest.payload.user.idToken, keys.CERTIFICATE));
  if (req.body.queryResult.action === "action_register") {
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
  bResponse.fulfillmentText = `Welcome to Route Alert! Good to have you with us. I have registered your number ${requestObj.queryResult.parameters.phone}. Thank you!`
  return bResponse;
}

//verify jwt for user information
function verifyJWT(token, cert){
  return jwt.verify(token, cert, {
    audience: keys.CLIENT_ID,
    issuer: "https://accounts.google.com"
  });
}
module.exports = router;
