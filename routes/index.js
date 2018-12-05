var express = require('express');
var router = express.Router();

const askLocationPermission = "Ask Location Permission";

const permission = {
  "payload": {
    "google": {
      "expectUserResponse": true,
      "systemIntent": {
        "intent": "actions.intent.PERMISSION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
          "optContext": "to locate you",
          "permissions": [
            "DEVICE_PRECISE_LOCATION"
          ]
        }
      }
    }
  },
  "outputContexts": [
    {
      "name": "projects/ra-beta/agent/sessions/f5b6137f-5de3-fcc8-6422-cee8f4ab4929/contexts/_actions_on_google",
      "lifespanCount": 99,
      "parameters": {
        "data": "{\"requestedPermission\":\"DEVICE_PRECISE_LOCATION\"}"
      }
    }
  ],
  "fulfillmentText": "Cannot display response in Dialogflow simulator. Please test on the Google As"
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next){
  console.log(req.body);
  console.log("User", req.body.originalDetectIntentRequest.payload.user);
  let test = {
    "fulfillmentText": "This is coming from Heroku!",
    "outputContexts": []
  }
  if(req.body.queryResult.action === "ask_location"){
    res.json(permission);
  }else{
    res.json(test);
  }
});

module.exports = router;
