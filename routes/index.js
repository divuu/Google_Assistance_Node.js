var db = require("../connection");
let express = require("express");
//const { Permission } = require("actions-on-google");
const { dialogflow, SignIn, Permission } = require("actions-on-google");
const app = dialogflow({
  // REPLACE THE PLACEHOLDER WITH THE CLIENT_ID OF YOUR ACTIONS PROJECT
  clientId:
    "114329969606 - m3t49hjn7vf5gdb6s3nq1ldrk2gjsl9e.apps.googleusercontent.com"
});
let router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../assets/keys.json");
let responses = [];
let test = [];
let responseNumber = 0;
let localvariable = "Hi i am new variable in the node.js";
let basicResponse = {
  payload: {
    google: {
      expectUserResponse: false,
      textToSpeech: "Congratulations! Your server is ready for Google Assistant"
      // "richResponse": {
      //   "items": []
      // }
    }
  }
};

// let reqs=req.body.user.userID;

let simpleResponse = {
  fulfillmentText: "This is a text response",
  fulfillmentMessages: [
    {
      card: {
        title: "card title",
        subtitle: "card text",
        imageUri:
          "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
        buttons: [
          {
            text: "button text",
            postback: "https://assistant.google.com/"
          }
        ]
      }
    }
  ],
  source: "example.com",
  payload: {
    google: {
      expectUserResponse: false,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "Today is not a holiday."
            }
          }
        ]
      }
    }
  }
};
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
  //req.render('index',{title:'Express'});
});

//actions.intent.TEXT

// Intent that starts the account linking flow.
app.intent("Start Signin", conv => {
  conv.ask(new SignIn("To get your account details"));
});
// Create a Dialogflow intent with the `actions_intent_SIGN_IN` event.
app.intent("Get Signin", (conv, params, signin) => {
  if (signin.status === "OK") {
    const payload = conv.user.profile.payload;
    conv.ask(
      `I got your account details, ${
        payload.name
      }. What do you want to do next?`
    );
  } else {
    conv.ask(
      `I won't be able to save your data, but what do you want to do next?`
    );
  }
});

//const { Permission } = require("actions-on-google");
app.intent("ask_for_permissions_detailed", conv => {
  // Choose one or more supported permissions to request:
  // NAME, DEVICE_PRECISE_LOCATION, DEVICE_COARSE_LOCATION
  const options = {
    context: "To address you by name and know your location",
    // Ask for more than one permission. User can authorize all or none.
    permissions: ["NAME", "DEVICE_PRECISE_LOCATION"]
  };
  conv.ask(new Permission(options));
});

router.post("/webhook", function(req, res, next) {
  //var newresponse = "";
  // let user = verifyJWT(req.body.originalDetectIntentRequest.payload.user.idToken, keys.CERTIFICATE);
  //checking data
  console.log("Request", req.body);
  // console.log("Payload", req.body.originalDetectIntentRequest.payload);
  // console.log("Token", req.body.originalDetectIntentRequest.payload.user.idToken);
  console.log("User");
  // if (req.body.queryResult.action === "action_register") {
  //   thisResponse = JSON.parse(JSON.stringify(basicResponse));
  //   res.json(register(thisResponse, req.body, user));
  // } else {
  responses.push({
    response_number: responseNumber++,
    payload: req.body
  });

  if (req.body.queryResult.action == "Action_Holidays") {
    //let idarray = [1, 2, 3];
    let spquery = "CALL holiday_info(2)";
    // console.log("spquery", spquery);
    db.query(spquery);
    // db.query("SELECT * FROM holidays", function(err, results, fields) {
    // if (err) throw err;
    // console.log("Results", results);
    // console.log("Fields", fields);
    // test.push({
    //   results: results,
    //   fields: fields
    // });
    //Where is

    db.query("SELECT * FROM temph", function(err, results, fields) {
      if (err) throw err;
      console.log("Results", results);
      console.log("Fields", fields);
      test.push({
        results: results,
        fields: fields
      });
      //res.json(
      simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `yes Kid !! Next Holiday is on ${
        results[results.length - 1].holiday_name
      }`;
    });
    // });
  } else {
    simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech =
      "I am not configured for this intent that was fired. Good Stuff Keep Scoring.";
  }
  res.json(simpleResponse);
  //req.json();
  // }
  // making the flower of thr slinked in
});

router.get("/responses", function(req, res, next) {
  res.json(responses);
});

router.get("/test", function(req, res, next) {
  res.json(test);
});
router.get("/mysql", function(req, res) {
  db.query("SELECT * FROM temph", function(err, results, fields) {
    if (err) throw err;
    console.log("Results", results);
    console.log("Fields", fields);
    res.json(results);
  });
});

//db.get(req, res);
// handles registration process
// adds in the data base
// function register(bResponse, requestObj, user) {
//   //to do logic to add to db
//   bResponse.payload.google.richResponse.items.push(
//     {
//       "simpleResponse": {
//         // "ssml": "<speak>Hi " + user.name + "! Good to have you with us. I have registered your number <say-as interpret-as='telephone'>" +  + "<say-as> with your email-Id, " +  +". Thank you!</speak>"
//         // "ssml": `<speak>Hi! Good to have you with us. I have registered your number <say-as interpret-as=\"characters\">${requestObj.queryResult.parameters.phone}</say-as> with your email-Id, ${user.email}. Thank you!</speak>`
//       }
//     }
//   );
//   return bResponse;
// }

// //verify jwt for user information
// function verifyJWT(token, cert) {
//   return jwt.verify(token, cert, {
//     audience: keys.CLIENT_ID,
//     issuer: "https://accounts.google.com"
//   });
// }
module.exports = router;
