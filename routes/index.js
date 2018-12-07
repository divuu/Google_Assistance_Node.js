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
  let user = verifyJWT(req.body.originalDetectIntentRequest.payload.user.idToken, keys.CERTIFICATE);
  //checking data
  // console.log("Request", req.body);
  // console.log("Payload", req.body.originalDetectIntentRequest.payload);
  // console.log("Token", req.body.originalDetectIntentRequest.payload.user.idToken);
  console.log("User", );
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
  // bResponse.payload.google.richResponse.items.push(
  //   {
  //     "simpleResponse": {
  //       "ssml": `<speak>Hi ${user.name}! Good to have you with us. I have registered your number <say-as interpret-as='telephone'>${requestObj.queryResult.parameters.phone}<say-as> with your email-Id, ${user.email}. Thank you!</speak>`,
  //       "displayText": `Hi ${user.name}! Good to have you with us. I have registered your number ${requestObj.queryResult.parameters.phone} with your email-Id, ${user.email}. Thank you!`
  //     }
  //   });
  // console.log(bResponse);
  return {
    "payload": {
      "google": {
        "expectUserResponse": false,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "ssml": "<speak>Here are <say-as interpret-as=\"characters\">SSML</say-as> samples. I can pause <break time=\"3\" />. I can play a sound <audio src=\"https://actions.google.com/sounds/v1/alarms/winding_alarm_clock.ogg\">your wave file</audio>. I can speak in cardinals. Your position is <say-as interpret-as=\"cardinal\">10</say-as> in line. Or I can speak in ordinals. You are <say-as interpret-as=\"ordinal\">10</say-as> in line. Or I can even speak in digits. Your position in line is <say-as interpret-as=\"digits\">10</say-as>. I can also substitute phrases, like the <sub alias=\"World Wide Web Consortium\">W3C</sub>. Finally, I can speak a paragraph with two sentences. <p><s>This is sentence one.</s><s>This is sentence two.</s></p></speak>",
                "displayText": "This is a SSML sample. Make sure your sound is enabled to hear the demo"
              }
            }
          ]
        }
      }
    }
  };
}

//verify jwt for user information
function verifyJWT(token, cert){
  return jwt.verify(token, cert, {
    audience: keys.CLIENT_ID,
    issuer: "https://accounts.google.com"
  });
}
module.exports = router;
