let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require("../assets/keys.json");
let basicResponse = {
  "payload": {
    "google": {
      "expectUserResponse": false,
      "richResponse": {
        "items": []
      }
    }
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function (req, res, next) {
  let user = verifyJWT(req.body.originalDetectIntentRequest.payload.user.idToken, keys.CERTIFICATE);
  //checking data
  // console.log("Request", req.body);
  // console.log("Payload", req.body.originalDetectIntentRequest.payload);
  // console.log("Token", req.body.originalDetectIntentRequest.payload.user.idToken);
  console.log("User");
  if (req.body.queryResult.action === "action_register") {
    thisResponse = JSON.parse(JSON.stringify(basicResponse));
    res.json(register(thisResponse, req.body, user));
  } else {
    res.json(basicResponse);
  }
});

// handles registration process
// adds in the data base
function register(bResponse, requestObj, user) {
  //logic to add to db
  // bResponse.fulfillmentText = `Hi ${user.name}! Good to have you with us. I have registered your number ${requestObj.queryResult.parameters.phone} with your email-Id, ${user.email}. Thank you!`
  // bResponse.fulfillmentMessages = [
  //   {
  //     "simpleResponses": [
  //       {
  //         "textToSpeech": "Registered",
  //         "ssml": "<speak>Hi " + user.name + "! Good to have you with us. I have registered your number <say-as interpret-as='telephone'>" + requestObj.queryResult.parameters.phone + "<say-as> with your email-Id, " + user.email +". Thank you!</speak>",
  //         "displayText": "Hello"
  //       }
  //     ]
  //   }
  // ]
  // console.log(bResponse);
  bResponse.payload.google.richResponse.items.push(
    {
      "simpleResponse": {
        // "ssml": "<speak>Hi " + user.name + "! Good to have you with us. I have registered your number <say-as interpret-as='telephone'>" + requestObj.queryResult.parameters.phone + "<say-as> with your email-Id, " + user.email +". Thank you!</speak>"
        "ssml": '<speak>Hi! Good to have you with us. I have registered your number <say-as interpret-as=telephone>9939141858</say-as> with your email-Id, abc@aa.com. Thank you!</speak>'
      }
    }
  );
  return bResponse;
}

//verify jwt for user information
function verifyJWT(token, cert) {
  return jwt.verify(token, cert, {
    audience: keys.CLIENT_ID,
    issuer: "https://accounts.google.com"
  });
}
module.exports = router;
