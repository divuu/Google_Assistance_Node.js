var db = require("../connection");
let express = require("express");
//const { Permission } = require("actions-on-google");
//const { dialogflow, SignIn, Permission } = require("actions-on-google");
var jwtDecode = require("jwt-decode");
let router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../assets/keys.json");
let sysuserdataArray = [];
let test = [];
let responseNumber = 0;
var sessionUserData = {};

let basicResponse = {
  payload: {
    google: {
      expectUserResponse: true,
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
          },
          {
            // basicCard: {
            // title: "Bus Details",
            // subtitle:
            //   "MPS Transport Manager :- Avinash Tiwari \nMobile Number :- 5678643522 \nBus Registration Number :- AS 64 GF3426",
            // formattedText: "Via swamy Vivekananda road",
            carouselBrowse: {
              items: [
                {
                  title: "View In Map",
                  openUrlAction: {
                    url:
                      "http://maps.google.com/maps?daddr=26.103816666666667,91.71967333333333&amp;ll="
                  },
                  description: "View the live location in Google Map",
                  image: {
                    url:
                      "https://res.cloudinary.com/techmky/image/upload/v1566890722/call_e6w5rk.png",
                    accessibilityText: "Image alternate text"
                  }
                },
                {
                  title: "Share Bus Location",
                  openUrlAction: {
                    url: "https://api.whatsapp.com/send?text="
                  },
                  description: "Share Bus Live location on WhatsApp",
                  image: {
                    url:
                      "https://res.cloudinary.com/techmky/image/upload/v1566890722/call3_wmr7qk.png",
                    accessibilityText: "Image alternate text"
                  }
                },
                {
                  title: "Call RouteAlert",
                  openUrlAction: {
                    url: "https://example.com"
                  },
                  description: "Call RouteAlert Support Team For Any Help !",
                  image: {
                    url:
                      "https://res.cloudinary.com/techmky/image/upload/v1566890722/call3_wmr7qk.png",
                    accessibilityText: "Image alternate text"
                  }
                }
              ]
            }
            // buttons: [
            //   {
            //     title: "View In Map",
            //     openUrlAction: {
            //       url:
            //         "http://maps.google.com/maps?daddr=26.103816666666667,91.71967333333333&amp;ll="
            //     }
            //   }
            // {
            //   title: "Share Bus location",
            //   openUrlAction: {
            //     url: "https://api.whatsapp.com/send?text="
            //   }
            // },
            // {
            //   title: "Call RouteAlert",
            //   openUrlAction: {
            //     url: "tel:09066841400"
            //   }
            // },
            // {
            //   title: "FeedBack",
            //   openUrlAction: {
            //     url:
            //       "https://www.google.com/search?hl=en-IN&ei=i4lfXdXvMcTSz7sP_vOjwA8&q=RouteAlert&kgmid=/g/11f0kx2f8h&ved=2ahUKEwiV4abEsJjkAhVE6XMBHf75CPgQkssBMAB6BAgAEAE#lkt=LocalPoiReviews&trex=m_t:lcl_akp,rc_f:nav,rc_ludocids:13239510625775536486,rc_q:RouteAlert,ru_q:RouteAlert"
            //   }
            // }
            //]
          }
        ]
      }
    }
  }
};
//   }
// };

/* GET home page. Used to check whether the server is running or not */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
  //req.render('index',{title:'Express'});
});

// router.post("/webhook", function(req, res, next) {
//   console.log("REQUEST BODY", JSON.stringify(req.body));

//   res.json(basicResponse);
// });

router.post("/webhook", function(req, res, next) {
  // google fires any intent

  let user = verifyJWT(
    req.body.originalDetectIntentRequest.payload.user.idToken,
    keys.CERTIFICATE
  );
  //checking data
  console.log("USER", user);
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

  // resp.push({
  //   incoming_payload: req.body,
  //   number: count++
  //   //user: user,
  //   // decoded: decoded,
  //   // token: req.body.originalDetectIntentRequest.payload.user.idToken
  // });

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

  // Intent For Verification of sysuser and Parents
  // Send Parameters :- take PIN from parents/sysuser.
  // Receive Parameters :- A welcome sentence will be fired.
  if (req.body.queryResult.action == "action_welcome") {
    var PIN = req.body.queryResult.parameters.PIN;
    //Validation of pin()
    let spquery = "CALL sp_rga_pin_verification('" + PIN + "')";
    console.log("spquery", spquery);
    db.query(spquery, true, (error, results, fields) => {
      if (error) {
        return console.log(error.message);
      }

      console.log("Result", results);
      console.log("Result[0]", results[0]);

      //console.log("Actual Name of sysuser", tabledata_json[0].name);

      if (results[0].length == 0) {
        basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = ` Sorry, your PIN is invalid. We cant find the user in our records. Thank you for your interest in RouteAlert. `;
        res.json(basicResponse);
      } else {
        var tabledata = JSON.stringify(results[0]);
        var tabledata_json = JSON.parse(tabledata);

        sysuserdataArray.push({
          response_number: responseNumber++,
          length: tabledata_json.length,
          payload: tabledata_json
        });

        console.log("user data Array", sysuserdataArray);
        console.log("tabledat_json", tabledata_json);

        // Check data values for sysuser or Parent
        if (tabledata_json[0].passenger_id) {
          console.log("PIN Verfication Passenger master");

          basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `  Welcome ${tabledata_json[0].name} of ${tabledata_json[0].org_name}. Do you want to know the location of your school bus ? `;
          //Store User Data With Session

          tabledata_json
            .filter(val => val.running_route_id == 0)
            .forEach(val => {
              userDataWithSession(
                req.body.originalDetectIntentRequest.payload.conversation
                  .conversationId,
                val
              );
            });

          //res.json(sessionUserData);
          res.json(basicResponse);
        } else {
          console.log("PIN Verfication SysUser Master");

          //Check for sysUser Organization
          if (tabledata_json.length > 1) {
            console.log("In multiple School");
            basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${tabledata_json[0].role_name}  ${tabledata_json[0].user_name}. Welcome to Route Alert. Which School's information do you want to know about ?`;
            //Store User Data With Session
            userDataWithSession(
              req.body.originalDetectIntentRequest.payload.conversation
                .conversationId,
              tabledata_json
            );
            //res.json(sessionUserData);
            res.json(basicResponse);
          } else {
            if (tabledata_json.length == 1) {
              console.log("In Single School");
              basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${tabledata_json[0].role_name}  ${tabledata_json[0].user_name}. Welcome to Route Alert. Which School Bus' location do you want to know about ?`;
              //Store User Data With Session
              tabledata_json.forEach(val => {
                userDataWithSession(
                  req.body.originalDetectIntentRequest.payload.conversation
                    .conversationId,
                  val
                );
              });
              res.json(basicResponse);
            }
          }
        }
      }
    });
  }

  // For SysUser with Multiple School Bus Info
  // Send Parameters :- input Bus Number eg:- Maria public School, Bus Number 1.
  // Receive Parameters :- give back the Bus Details.
  if (req.body.queryResult.action == "Action_sysuser_multiple_school") {
    var schoolNameUser = req.body.queryResult.parameters.SchoolName; // School Name from the user
    var busRouteNumber = req.body.queryResult.parameters.BusNumber; // Route 1 or Bus 1 or MPS Route 1... it will return 1 ( fetches the number )
    console.log("BusRouteNumber", busRouteNumber);
    console.log("SchoolName", schoolNameUser);

    operationArray = [];
    var count = 0;
    let school =
      sessionUserData[
        req.body.originalDetectIntentRequest.payload.conversation.conversationId
      ].payload;

    console.log("School", school);
    school.forEach(val => {
      console.log("value in loop", val.org_name);
      if (val.org_name == schoolNameUser) {
        operationArray.push({ short: val.short_name, full: val.org_name });
        console.log("Operation", operationArray);
      } else {
        console.log("NO Match");
        count++;
      }
    });
    console.log("schoolarray", schoolarray);

    if (count < school.length) {
      let finalStr;
      if (typeof busRouteNumber == "number") {
        finalStr =
          operationArray.short_name + " " + "Route" + " " + busRouteNumber;
        console.log("Bus String", finalStr);
      } else {
        let strafter = busRouteNumber.replace(/[A-Za-z$-]/g, "");
        finalStr = operationArray.short_name + " " + "Route" + " " + strafter;
        console.log("Bus String", finalStr);
      }
      let spquery = "CALL sp_assistant_stop_for_sysuser('" + finalStr + "')";
      console.log("spquery", spquery);
      db.query(spquery, true, (error, results, fields) => {
        if (error) {
          return console.log(error.message);
        }
        console.log("Result", results);
        console.log("Result[0]", results[0]);
        var tabledata = JSON.stringify(results[0]);
        var tabledata_json = JSON.parse(tabledata);
        console.log(tabledata);
        console.log(tabledata_json);
        console.log("Actual address", tabledata_json[0].stop_name);

        simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus MPS Route 1 was Last seen 2 Min Ago near
        ${tabledata_json[0].stop_name}. Please Click the Link below to view in map.`;
        // simpleResponse.payload.google.richResponse.items[1].basicCard.formattedText = ` ${
        //   tabledata_json[0].stop_name
        // }`;
        // simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url = `http://maps.google.com/maps?daddr=${
        //   tabledata_json[0].location
        // }&amp;ll=`;
        // simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[1].openUrlAction.url = `https://api.whatsapp.com/send?text=${
        //   tabledata_json[0].location
        // }`;
        res.json(simpleResponse);
      });
    } else {
      basicResponse.payload.google.expectUserResponse = "false";
      basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `It seems ${schoolNameUser} is not in Your records`;
      res.json(basicResponse);
    }
  }

  // For SysUser with Single School Bus Info
  // Send Parameters :- input Bus Number eg:- MPS Route 1.
  // Receive Parameters :- give back the Bus Details.
  if (req.body.queryResult.action == "Action_Sysuser_schoolbusDetail") {
    var busRouteNumber = req.body.queryResult.parameters.BusRouteNumber; // Route 1 or Bus 1 or MPS Route 1... it will return 1 ( fetches the number )
    console.log("BusRouteNumber", busRouteNumber);
    let prefix =
      sessionUserData[
        req.body.originalDetectIntentRequest.payload.conversation.conversationId
      ].short_name;
    let finalStr;
    if (typeof busRouteNumber == "number") {
      finalStr = prefix + " " + busRouteNumber;
      console.log("Bus String", finalStr);
    } else {
      let strafter = busRouteNumber.replace(/[A-Za-z$-]/g, "");
      finalStr = prefix + " " + strafter;
      console.log("Bus String", finalStr);
    }
    let spquery = "CALL sp_assistant_stop_for_sysuser('" + finalStr + "')";
    console.log("spquery", spquery);
    db.query(spquery, true, (error, results, fields) => {
      if (error) {
        return console.log(error.message);
      }
      console.log("Result", results);
      console.log("Result[0]", results[0]);
      var tabledata = JSON.stringify(results[0]);
      var tabledata_json = JSON.parse(tabledata);
      console.log(tabledata);
      console.log(tabledata_json);
      console.log("Actual address", tabledata_json[0].stop_name);

      simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus MPS Route 1 was Last seen 2 Min Ago near
      ${tabledata_json[0].stop_name}. Please Click the Link below to view in map.`;
      // simpleResponse.payload.google.richResponse.items[1].basicCard.formattedText = ` ${
      //   tabledata_json[0].stop_name
      // }`;
      // simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url = `http://maps.google.com/maps?daddr=${
      //   tabledata_json[0].location
      // }&amp;ll=`;
      // simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[1].openUrlAction.url = `https://api.whatsapp.com/send?text=${
      //   tabledata_json[0].location
      // }`;
      res.json(simpleResponse);
      //res.json(basicResponse);
    });
  }

  //Temporary Disabled enable for parent
  // if (req.body.queryResult.action == "action_welcome") {
  //   var username = decoded.name;
  //   basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${username}! Welcome to Route Alert. Do you want to know the location of your School Bus ?`;
  //   res.json(basicResponse);
  // }

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

  //if (req.body.queryResult.action == "Action_Bus_Route" || "DefaultWelcomeIntent.DefaultWelcomeIntent-yes") {
  if (
    req.body.queryResult.action ==
    "DefaultWelcomeIntent.DefaultWelcomeIntent-yes"
  ) {
    console.log("HELLO I'M IN Action Bus Route Start");
    //to do logic to add to db
    var RouteNo = req.body.queryResult.parameters.RouteNo;
    console.log(RouteNo);
    let spquery = "CALL sp_assistant_address(23727)";
    //let spquery = "CAll sp_assistant_stop(23727)";
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
      console.log("Actual Address", json[0].address);
      simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus MPS Route 1 was Last seen 2 Min Ago near
        ${json[0].address}. Please Click the Link below to view in map.`;
      simpleResponse.payload.google.richResponse.items[1].basicCard.formattedText = ` ${json[0].address} `;
      simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url = `http://maps.google.com/maps?daddr=${json[0].location}&amp;ll=`;
      simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[1].openUrlAction.url = `https://api.whatsapp.com/send?text=${json[0].location}`;

      res.json(simpleResponse);
    });
  } else {
    console.log("HELLO I'M IN Action Bus Route END");
    // simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech =
    //   "Failed";
    // res.json(simpleResponse);
  }
});

router.get("/responses", function(req, res, next) {
  //res.json(resp);
  res.json(sysuserdataArray);
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
      ssml: `<speak>Hi! Good to have you with us. I have registered your number <say-as interpret-as=\"characters\">${requestObj.queryResult.parameters.MobileNo}</say-as> with your email-Id, ${decoded.email}. Thank you!</speak>`
      //ssml: `<speak>Hi! Good to have you with us.`
    }
  });
  return bResponse;
}
// Verify
//verify jwt for user information
function verifyJWT(token, cert) {
  console.log("VerifyJWT", token, "CERT", cert);
  return jwt.verify(token, cert, function(err, pass) {
    if (err) {
      console.log(err);
    } else {
      console.log(pass);
    }
  });
}

//Saves the User data after pin verification with ConversationID
function userDataWithSession(conversationID, parameter) {
  if (Array.isArray(parameter)) {
    sessionUserData[conversationID] = {
      payload: Array.from(parameter)
    };
  } else {
    sessionUserData[conversationID] = Object.assign({}, parameter);
  }
}

module.exports = router;
