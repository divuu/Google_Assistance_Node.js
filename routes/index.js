var db = require("../connection");
let express = require("express");
//const { Permission } = require("actions-on-google");
//const { dialogflow, SignIn, Permission } = require("actions-on-google");
var jwtDecode = require("jwt-decode");
let router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../assets/keys.json");
let resp = [];
let sysuserdataArray = [];
//let request = [];
let test = [];
let responseNumber = 0;
//let localvariable = "Hi i am new variable in the node.js";

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
                  title: "Bus Details",
                  description:
                    "MPS Transport Manager :- Avinash Tiwari \nMobile Number :- 5678643522 \nBus Registration Number :- AS 64 GF3426",
                  footer: "Bus Is near Via swamy Vivekananda road"
                },
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
    console.log("DUMP:", req);

    var PIN = req.body.queryResult.parameters.PIN;
    //let spquery = "CALL sp_sysuser_verification(" + PIN + ")";
    let spquery = "CALL sp_rga_pin_verification('" + PIN + "')";
    console.log("spquery", spquery);
    db.query(spquery, true, (error, results, fields) => {
      if (error) {
        return console.log(error.message);
      }

      if (tabledata_json.length == 0) {
        basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `! It Seems your PIN is Incorrect Or You are Not Authorised For This Service. Kindly Contact RouteAlert Support Team.`;
        res.json(basicResponse);
      } else {
        console.log("Result", results);
        console.log("Result[0]", results[0]);

        var tabledata = JSON.stringify(results[0]);
        var tabledata_json = JSON.parse(tabledata);

        //console.log(fields);
        sysuserdataArray.push({
          response_number: responseNumber++,
          length: tabledata_json.length,
          payload: tabledata_json
        });

        console.log(tabledata);
        console.log(tabledata_json);
        //console.log("Actual Name of sysuser", tabledata_json[0].name);

        // Check data values for sysuser or Parent
        if (tabledata[0].passenger_id) {
          console.log("PIN from Parent master");
        } else {
          console.log("PIN FROM Sys User");

          //Check for sysUser Organization
          if (sysuserdataArray.length > 1) {
            basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${
              tabledata_json[0].name
            }! Welcome to Route Alert. Which school do you want to check in to?`;
            res.json(basicResponse);
          } else {
            //if (sysuserdataArray.length == 1) {
            basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${
              tabledata_json[0].name
            }! Welcome to Route Alert. Which School Bus location Do you want to know ?`;
            res.json(basicResponse);
          }
        }
      }
      dumpIntoDatabase(req.body.queryResult.action, req, res, final);
    });
  }

  // For SysUser School Bus Info
  // Send Parameters :- take Bus Number.
  // Receive Parameters :- give back the Bus Details.
  if (req.body.queryResult.action == "Action_Sysuser_schoolbusDetail") {
    var busRouteID = req.body.queryResult.parameters.BusRouteID;
    console.log("BusRouteID", busRouteID);

    let prefix = ["MPS Route"];
    let finalStr;
    if (typeof busRouteID == "number") {
      finalStr = prefix + " " + busRouteID;
      console.log("Bus String", finalStr);
    } else {
      let strafter = busRouteID.replace(/[A-Za-z$-]/g, "");
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
      ${
        tabledata_json[0].stop_name
      }. Please Click the Link below to view in map.`;
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
    // basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Please wait i'm fetching the Current location of Bus ${finalStr}.`;
    // res.json(basicResponse);
    dumpIntoDatabase(req.body.queryResult.action, req, res);
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
      simpleResponse.payload.google.richResponse.items[1].basicCard.formattedText = ` ${
        json[0].address
      } `;
      simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[0].openUrlAction.url = `http://maps.google.com/maps?daddr=${
        json[0].location
      }&amp;ll=`;
      simpleResponse.payload.google.richResponse.items[1].basicCard.buttons[1].openUrlAction.url = `https://api.whatsapp.com/send?text=${
        json[0].location
      }`;

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
      ssml: `<speak>Hi! Good to have you with us. I have registered your number <say-as interpret-as=\"characters\">${
        requestObj.queryResult.parameters.MobileNo
      }</say-as> with your email-Id, ${decoded.email}. Thank you!</speak>`
      //ssml: `<speak>Hi! Good to have you with us.`
    }
  });
  return bResponse;
}

dumpIntoDatabase(intentName,request,resposnse,final){
  let logquery =
  "CALL sp_google_log(" +
  intentName +
  "," +
  request +
  "," +
  resposnse +
  ",finalComments)";
db.query(logquery, true, error => {
  if (error) {
    return console.log(error.message);
  }
});
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
module.exports = router;

// , {
//   audience: keys.CLIENT_ID,
//   issuer: "https://accounts.google.com"
// }
