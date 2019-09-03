var db = require("../connection");
let express = require("express");
//const { Permission } = require("actions-on-google");
//const { dialogflow, SignIn, Permission } = require("actions-on-google");
var jwtDecode = require("jwt-decode");
let router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../assets/keys.json");
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
            basicCard: {
              title: "Title: this is a title",
              subtitle: "This is a subtitle",
              formattedText:
                'This is a basic card.  Text in a basic card can include "quotes" and\n    most other unicode characters including emoji 📱.  Basic cards also support\n    some markdown formatting like *emphasis* or _italics_, **strong** or\n    __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other\n    things like line  \nbreaks',
              image: {
                url:
                  "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                accessibilityText: "Image alternate text"
              },
              buttons: [
                {
                  title: "This is a button",
                  openUrlAction: {
                    url: "https://assistant.google.com/"
                  }
                }
              ]
            }
          },
          {
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
                      "https://res.cloudinary.com/techmky/image/upload/v1566890723/google_map2_mnl6ns.png",
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
                      "https://res.cloudinary.com/techmky/image/upload/v1566899238/whatsapp_t9tj13.png",
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
                      "https://res.cloudinary.com/techmky/image/upload/v1566906021/call_resized_isstvt.png",
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
        var textforresponse =
          "Sorry, your PIN is invalid. We cant find the user in our records. Thank you for your interest in RouteAlert.";
        var responseObj = createResponse(false, textforresponse);
        res.json(responseObj);
      } else {
        var tabledata = JSON.stringify(results[0]);
        var tabledata_json = JSON.parse(tabledata);

        console.log("tabledat_json", tabledata_json);

        // Check data values for sysuser or Parent
        if (tabledata_json[0].passenger_id) {
          console.log("PIN Verfication Passenger master");
          basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `  Welcome ${tabledata_json[0].name} of ${tabledata_json[0].org_name}. Do you want to know the location of your school bus ? `;
          //Store User Data With Session

          userDataWithSession(
            req.body.originalDetectIntentRequest.payload.conversation
              .conversationId,
            tabledata_json
          );

          //res.json(sessionUserData);
          res.json(basicResponse);
        } else {
          console.log("PIN Verfication SysUser Master");

          //Check for sysUser Organization
          if (tabledata_json.length > 1) {
            console.log("In multiple School");
            basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${tabledata_json[0].user_name}. Welcome to Route Alert. Which School's information do you want to know about ?`;
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
              basicResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Hi ${tabledata_json[0].user_name}. Welcome to Route Alert. Which School Bus' location do you want to know about ?`;
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

  // this intent will work for Passenger School Bus Info
  // Send Parameters :- input Bus Number eg:- yes/Bus Number 1
  // Receive Parameters :- give back the Bus Details. from local only. it will not fetch the details from server.
  if (req.body.queryResult.action == "Action_passenger_bus_location") {
    console.log("Passenger Bus Location");
    if (
      sessionUserData.hasOwnProperty(
        req.body.originalDetectIntentRequest.payload.conversation.conversationId
      )
    ) {
      let passData = 0;
      sessionUserData[
        req.body.originalDetectIntentRequest.payload.conversation.conversationId
      ].payload
        .filter(val => val.running_route_id == 0)
        .forEach(val => {
          passData + val.running_route_id;
          //console.log(passData);
        });

      console.log("passData", passData);

      if (passData > 0) {
        console.log("The Pass data Has value greater than 0");
        let runningData = sessionUserData[
          req.body.originalDetectIntentRequest.payload.conversation
            .conversationId
        ].payload
          .filter(val => val.route_id == val.running_route_id)
          .forEach(val => {
            userDataWithSession(
              req.body.originalDetectIntentRequest.payload.conversation
                .conversationId,
              val
            );
          });

        simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus ${runningData.custom_name} was Last seen 2 Min Ago near ${runningData.stop_name}. Please Click the Link below to view in map.`;
        res.json(simpleResponse);
      } else {
        let Buscustomname =
          sessionUserData[
            req.body.originalDetectIntentRequest.payload.conversation
              .conversationId
          ].payload[0].custom_name;

        console.log("MAin Data From else", Buscustomname);

        // implemeting the logic[ check stop if not found check the address]
        let spquery =
          "CALL sp_rga_vehicle_location_nearby_stop('" + Buscustomname + "')";
        console.log("spquery", spquery);
        db.query(spquery, true, (error, results, fields) => {
          if (error) {
            return console.log(error.message);
          }
          console.log("Result", results);
          console.log("Result[0]", results[0]);
          var passengerstopdata = JSON.stringify(results[0]);
          var passengerstopdata_json = JSON.parse(passengerstopdata);
          console.log(passengerstopdata);
          console.log(passengerstopdata_json);

          if (passengerstopdata_json[0].stop_id) {
            console.log("Stop Name found");
            simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus ${Buscustomname} was Last seen 2 Min Ago near ${passengerstopdata_json[0].stop_name}. Please Click the Link below to view in map.`;
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
          } else {
            console.log("Stop Name Not found");
            var lat = passengerstopdata_json[0].last_seen_latitude;
            var long = passengerstopdata_json[0].last_seen_longitude;
            let spquery =
              "CALL sp_rga_location_nearby_address(" + lat + "," + long + ")";
            db.query(spquery, true, (error, results, fields) => {
              if (error) {
                return console.log(error.message);
              }

              var passengeraddressdata = JSON.stringify(results[0]);
              var passengeraddressdata_json = JSON.parse(passengeraddressdata);
              console.log(passengeraddressdata);
              console.log(passengeraddressdata_json);

              if (passengeraddressdata_json.length > 0) {
                console.log("IF address is there");
                simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus ${Buscustomname} was Last seen 2 Min Ago near ${passengeraddressdata_json[0].address}. Please Click the Link below to view in map.`;
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
              } else {
                console.log("Address not found");
                simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Please Click the Link below to view in map.`;
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
              }
            });
          }
        });
      }
    } else {
      var textforresponse = "It Seems Your Bus is Not In Our Record.";
      var responseObj = createResponse(false, textforresponse);
      res.json(responseObj);
    }
  }

  // For SysUser with Multiple School Bus Info
  // Send Parameters :- input Bus Number eg:- Maria public School, Bus Number 1.
  // Receive Parameters :- give back the Bus Details.
  if (req.body.queryResult.action == "Action_sysuser_multiple_school") {
    var schoolNameUser = req.body.queryResult.parameters.SchoolName; // School Name from the user
    var busRouteNumber = req.body.queryResult.parameters.BusNumber; // Route 1 or Bus 1 or MPS Route 1... it will return 1 ( fetches the number )
    let sysUseData = null;
    sessionUserData[
      req.body.originalDetectIntentRequest.payload.conversation.conversationId
    ].payload
      .filter(val => {
        return val.org_name == schoolNameUser;
      })
      .forEach(val => {
        sysUseData = Object.assign({}, val);
      });
    // console.log("schoolarray", schoolarray);

    if (sysUseData && sysUseData.org_name) {
      let finalStr;
      if (typeof busRouteNumber == "number") {
        finalStr = sysUseData.short_name + " " + "Route" + " " + busRouteNumber;
        console.log("Bus String", finalStr);
      } else {
        let strafter = busRouteNumber.replace(/[A-Za-z$-]/g, "");
        finalStr = sysUseData.short_name + " " + "Route" + " " + strafter;
        console.log("Bus String", finalStr);
      }

      let spquery =
        "CALL sp_rga_vehicle_location_nearby_stop('" + finalStr + "')";
      //Earlier we were using this
      //let spquery = "CALL sp_assistant_stop_for_sysuser('" + finalStr + "')";
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

        if (tabledata_json[0].stop_id) {
          console.log("Stop Name found");
          simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${tabledata_json[0].stop_name}. Please Click the Link below to view in map.`;
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
        } else {
          console.log("Stop Name Not found");
          var lat = tabledata_json[0].last_seen_latitude;
          var long = tabledata_json[0].last_seen_longitude;
          let spquery =
            "CALL sp_rga_location_nearby_address(" + lat + "," + long + ")";
          db.query(spquery, true, (error, results, fields) => {
            if (error) {
              return console.log(error.message);
            }
            //console.log("Result", results);
            //console.log("Result[0]", results[0]);
            var addressdata = JSON.stringify(results[0]);
            var addressdata_json = JSON.parse(addressdata);
            console.log(addressdata);
            console.log(addressdata_json);

            if (addressdata_json.length > 0) {
              console.log("IF address is there");
              simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${addressdata_json[0].address}. Please Click the Link below to view in map.`;
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
            } else {
              console.log("Address not found");
              simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Please Click the Link below to view in map.`;
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
            }
          });
        }
      });
    } else {
      var textforresponse = `It seems ${schoolNameUser} is not in Your records`;
      var responseObj = createResponse(false, textforresponse);
      res.json(responseObj);
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
      finalStr = prefix + " " + "Route" + " " + busRouteNumber;
      console.log("Bus String", finalStr);
    } else {
      let strafter = busRouteNumber.replace(/[A-Za-z$-]/g, "");
      finalStr = prefix + " " + "Route" + " " + strafter;
      console.log("Bus String", finalStr);
    }

    let spquery =
      "CALL sp_rga_vehicle_location_nearby_stop('" + finalStr + "')";
    //earlier we were using this
    //let spquery = "CALL sp_assistant_stop_for_sysuser('" + finalStr + "')";
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

      if (tabledata_json[0].stop_id) {
        console.log("Stop Name found");
        simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your Bus ${finalStr} was Last seen 2 Min Ago near ${tabledata_json[0].stop_name}. Please Click the Link below to view in map.`;
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
      } else {
        console.log("Stop Name Not found");
        var lat = tabledata_json[0].last_seen_latitude;
        var long = tabledata_json[0].last_seen_longitude;
        let spquery =
          "CALL sp_rga_location_nearby_address(" + lat + "," + long + ")";
        db.query(spquery, true, (error, results, fields) => {
          if (error) {
            return console.log(error.message);
          }

          //console.log("Result", results);
          //console.log("Result[0]", results[0]);
          var saddressdata = JSON.stringify(results[0]);
          var saddressdata_json = JSON.parse(saddressdata);
          console.log(saddressdata);
          console.log(saddressdata_json);

          if (saddressdata_json.length > 0) {
            simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Your ${finalStr} was Last seen 2 Min Ago near ${saddressdata_json[0].address}. Please Click the Link below to view in map.`;
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
          } else {
            simpleResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = `Ok ! I found your Bus. Please Click the Link below to view in map.`;
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
          }
        });
      }
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

// Create the dynamic reponse on the basis of Input paramets
function createResponse(boolean, textToSpeech) {
  return {
    payload: {
      google: {
        expectUserResponse: `${boolean}`,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: `${textToSpeech}`
              }
            }
          ]
        }
      }
    }
  };
}

module.exports = router;
