
// Verify
//verify jwt for user information
function verifyJWT(token, cert) {
    console.log("VerifyJWT", token, "CERT", cert);
    return jwt.verify(token, cert, function (err, pass) {
        if (err) {
            console.log(err);
        } else {
            console.log(pass);
        }
    });
}

if (req.body.queryResult.action == "asd" ) {
    console.log("HELLO I'M IN Action REGISTER Start");
    let thisResponse = JSON.parse(JSON.stringify(basicResponse));
    //res.json(basicResponse);
    res.json(register(thisResponse, req.body, decoded));
  }

// Decoding the JWT Token from the Google #not verifying Only decoding
var decoded = jwtDecode(
    req.body.originalDetectIntentRequest.payload.user.idToken
);

let user = verifyJWT(
    req.body.originalDetectIntentRequest.payload.user.idToken,
    keys.CERTIFICATE
);


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