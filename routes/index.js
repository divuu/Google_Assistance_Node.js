var express = require('express');
var router = express.Router();

let resData = {
  speech: "",
  displayText: "Testing",
  data:{
    google: {
      expected_user_response: false,
      is_ssml: false,
      permission_request:{
        opt_context: '',
        permissions: []
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
  resData.speech = 'Your bus is 5 mins away';
  resData.displayText = 'Your bus is 5 mins away'
  res.json(test);
});

module.exports = router;
