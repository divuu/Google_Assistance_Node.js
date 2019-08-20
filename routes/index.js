var db = require("../connection");
let express = require("express");
//const { Permission } = require("actions-on-google");
//const { dialogflow, SignIn, Permission } = require("actions-on-google");
var jwtDecode = require("jwt-decode");
let router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../assets/keys.json");
let resp = [];
//let request = [];
let test = [];
//let responseNumber = 0;
//let localvariable = "Hi i am new variable in the node.js";

let basicResponse = {
  payload: {
    google: {
      expectUserResponse: false,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech:
                "Today is not a holiday. From Register intent. finally success."
            }
          }
        ]
      }
    }
  }
};

// let basicResponse = {
//   payload: {
//     google: {
//       expectUserResponse: false,
//       textToSpeech: "Congratulations! Your server is ready for Google Assistant"
//       // "richResponse": {
//       //   "items": []
//       // }
//     }
//   }
// };

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
      expectUserResponse: true,
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

router.post("/webhook", function(req, res, next) {
  //var newresponse = "";
  // let user = verifyJWT(req.body.originalDetectIntentRequest.payload.user.idToken, keys.CERTIFICATE);
  //checking data
  //console.log("Request", req.body);
  console.log("Request", req.body);
  console.log("Payload", req.body.originalDetectIntentRequest.payload);
  console.log(
    "Token",
    req.body.originalDetectIntentRequest.payload.user.idToken
  );
  // Decoding the JWT Token from the Google #not verifying Only decoding
  var decoded = jwtDecode(
    req.body.originalDetectIntentRequest.payload.user.idToken
  );
  console.log(decoded);

  // let user = verifyJWT(
  //   req.body.originalDetectIntentRequest.payload.user.idToken,
  //   keys.CERTIFICATE
  // );
  // console.log("User");
  // if (req.body.queryResult.action === "action_register") {
  //   thisResponse = JSON.parse(JSON.stringify(basicResponse));
  //   res.json(register(thisResponse, req.body, user));
  // } else {
  // resp.push({
  //   response_number: responseNumber++,
  //   payload: req.body
  // });

  // resp.push({
  //   incoming_payload: req.body,
  //   number: count++,
  //   //user: user,
  //   decoded: decoded,
  //   token: req.body.originalDetectIntentRequest.payload.user.idToken
  // });

  if (req.body.queryResult.action == "action_welcome") {
    var username = decoded.name;
    simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hello!! ${username}. Do you want to know the location of your School Bus ?`;
    res.json(simpleResponse);
  }

  if (req.body.queryResult.action == "Action_Holidays") {
    //let idarray = [1, 2, 3];
    let spquery = "CALL holiday_info(3)";
    console.log("spquery Is fired", spquery);
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
      // if (err) throw err;
      console.log("Results", results);
      console.log("Fields", fields);
      test.push({
        results: results,
        fields: fields
      });
      //res.json(
      simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `yes Kid !! Next Holiday is on 
      ${results[results.length - 1].holiday_name}.`;

      res.json(simpleResponse);
      // else {
      //   simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech =
      //     "I am not configured for this intent that was fired. Good Stuff Keep Scoring.";
      // }
    });
  }

  if (req.body.queryResult.action == "action_register") {
    console.log("HELLO I'M IN Action REGISTER Start");
    let thisResponse = JSON.parse(JSON.stringify(basicResponse));
    //res.json(basicResponse);
    res.json(register(thisResponse, req.body, decoded));
  } else {
    console.log("HELLO I'M IN Action REGISTER END");
    //res.json(resp);
    //res.json(simpleResponse);
  }

  if (req.body.queryResult.action == "Action_Bus_Route") {
    console.log("HELLO I'M IN Action Bus Route Start");
    //to do logic to add to db
    var RouteNo = req.body.queryResult.parameters.RouteNo;
    console.log(RouteNo);
    //let spquery = "CALL sp_assistant_address(" + RouteNo + ")";
    let spquery = "CAll sp_assistant_stop(23727)";
    console.log(spquery);
    db.query(spquery, true, (error, results, fields) => {
      if (error) {
        return console.log(error.message);
      }
      console.log("Result", results);
      console.log("Result[0]", results[0]);
      var address = JSON.stringify(results[0]);
      var json = JSON.parse(address);
      console.log(fields);
      console.log(address);
      console.log(json);
      console.log("Actual Address", json[0].stop_name);
      simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Whooo!! I found you Bus. The Bus is near
        ${json[0].stop_name}`;
      res.json(simpleResponse);
    });
  } else {
    console.log("HELLO I'M IN Action Bus Route END");
    simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech =
      "Failed";
    res.json(simpleResponse);
  }
});

router.get("/responses", function(req, res, next) {
  res.json(resp);
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

// handles registration process
// adds in the data base
function register(bResponse, requestObj, decoded) {
  //to do logic to add to db
  let spquery = "CALL sp_assistant_user(1)";
  db.query(spquery, true, (error, results, fields) => {
    if (error) {
      return console.log(error.message);
    }
    console.log(results[0]);
    console.log(fields);
  });
  bResponse.payload.google.richResponse.items.push({
    simpleResponse: {
      // ssml:
      //   "<speak>Hi " +
      //   user.name +
      //   "! Good to have you with us. I have registered your number <say-as interpret-as='telephone'>" +
      //   +"<say-as> with your email-Id, " +
      //   +". Thank you!</speak>"
      ssml: `<speak>Hi! Good to have you with us. I have registered your number <say-as interpret-as=\"characters\">${
        requestObj.queryResult.parameters.MobileNo
      }</say-as> with your email-Id, ${decoded.email}. Thank you!</speak>`
      //ssml: `<speak>Hi! Good to have you with us.`
    }
  });
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
