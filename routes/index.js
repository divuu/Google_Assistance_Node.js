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
          "optContext": "To deliver your order",
          "permissions": [
            "NAME",
            "DEVICE_PRECISE_LOCATION"
          ]
        }
      }
    }
  }
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
  if(req.body.intent.displayName === askLocationPermission){
    res.json(permission);
  }else{
    res.json(test);
  }
});

module.exports = router;
